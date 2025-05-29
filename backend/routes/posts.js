const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const School = require('../models/School');
const { authenticate } = require('../middleware/auth');
const ContentModerationService = require('../services/contentModeration');
const aiModerationService = require('../services/aiModerationService');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/posts/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Create a new post
router.post('/', [
  authenticate,
  upload.array('media', 4),
  body('content').notEmpty().isLength({ min: 1, max: 5000 }).withMessage('Content is required and must be between 1-5000 characters'),
  body('postType').optional().isIn(['achievement', 'study', 'general', 'notice', 'announcement']),
  body('category').optional().isIn(['academic', 'sports', 'cultural', 'general', 'announcement', 'notice'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const user = req.user;
    const { content, postType, category, formatting } = req.body;

    // Handle uploaded media
    const mediaUrls = req.files ? req.files.map(file => ({
      type: 'image',
      url: `/uploads/posts/${file.filename}`,
      caption: ''
    })) : [];

    // Determine author model and role
    let authorModel, authorRole;
    if (user.constructor.modelName === 'Student') {
      authorModel = 'Student';
      authorRole = 'student';
    } else if (user.constructor.modelName === 'Teacher') {
      authorModel = 'Teacher';
      authorRole = 'teacher';
    } else if (user.constructor.modelName === 'School') {
      authorModel = 'School';
      authorRole = 'school';
    }

    // Enhanced content moderation using Gemini AI
    console.log(`Moderating content from ${authorRole}:`, content.substring(0, 100) + '...');
    const moderationResult = await aiModerationService.moderateContent(content, authorRole);

    // Create post
    const post = new Post({
      content,
      author: user._id,
      authorModel,
      school: user.school || user._id, // Use user._id for schools
      postType: postType || 'general',
      category: category || 'general',
      media: mediaUrls,
      formatting: formatting || {},
      status: moderationResult.flag === 'Green Flag' ? 'approved' : 'flagged',
      moderationResult: {
        aiFlag: moderationResult.flag,
        aiTimestamp: new Date(),
        confidence: moderationResult.confidence,
        reason: moderationResult.reason,
        autoApproved: moderationResult.autoApproved || false,
        schoolApproval: authorModel === 'School' ? true : null,
        geminiResponse: moderationResult.aiResponse || null
      }
    });

    // Generate unique address
    post.generateUniqueAddress();

    await post.save();

    // If flagged, add to school's flagged posts
    if (moderationResult.flag === 'Red Flag') {
      const school = await School.findById(user.school || user._id);
      if (school) {
        school.flaggedPosts.push(post._id);
        await school.save();
      }
    }

    // Update user's post count and stats
    if (authorModel === 'Student') {
      user.stats.totalPosts = (user.stats.totalPosts || 0) + 1;
      user.updateStreak();
    } else if (authorModel === 'Teacher') {
      await user.updateStats();
    }
    await user.save();

    res.json({
      success: true,
      message: 'Post created successfully',
      data: {
        id: post._id,
        content: post.content,
        status: post.status,
        uniqueAddress: post.uniqueAddress,
        moderationResult: {
          flag: post.moderationResult.aiFlag,
          reason: post.moderationResult.reason,
          confidence: post.moderationResult.confidence,
          autoApproved: post.moderationResult.autoApproved
        },
        createdAt: post.createdAt
      }
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get post by ID or unique address
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by ID first, then by unique address
    let post = await Post.findById(identifier)
      .populate('author', 'profile.name profile.avatar enrollmentId email')
      .populate('comments.user', 'profile.name profile.avatar')
      .populate('likes', 'profile.name profile.avatar');

    if (!post) {
      post = await Post.findOne({ uniqueAddress: identifier })
        .populate('author', 'profile.name profile.avatar enrollmentId email')
        .populate('comments.user', 'profile.name profile.avatar')
        .populate('likes', 'profile.name profile.avatar');
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post'
    });
  }
});

// Get feed posts
router.get('/feed/:userType', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { userType } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const feedPosts = await Post.getFeedPosts(user, userType, page, limit);

    res.json({
      success: true,
      data: {
        posts: feedPosts,
        currentPage: page,
        hasMore: feedPosts.length === limit
      }
    });

  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feed'
    });
  }
});

// Like/Unlike a post
router.post('/:postId/like', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.user;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const hasLiked = post.likes.includes(user._id);

    if (hasLiked) {
      // Unlike
      post.likes = post.likes.filter(like => !like.equals(user._id));
    } else {
      // Like
      post.likes.push(user._id);

      // Notify author if it's not their own post
      if (!post.author.equals(user._id)) {
        const authorModel = post.authorModel;
        let author;

        if (authorModel === 'Student') {
          author = await Student.findById(post.author);
        } else if (authorModel === 'Teacher') {
          author = await Teacher.findById(post.author);
        }

        if (author) {
          author.addNotification(
            'like',
            `${user.profile.name} liked your post`,
            {
              relatedPost: post._id,
              relatedUser: user._id,
              relatedUserModel: user.constructor.modelName
            }
          );
          await author.save();
        }
      }
    }

    await post.save();

    res.json({
      success: true,
      message: hasLiked ? 'Post unliked' : 'Post liked',
      data: {
        likesCount: post.likes.length,
        hasLiked: !hasLiked
      }
    });

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating like'
    });
  }
});

// Add comment to a post
router.post('/:postId/comments', [
  authenticate,
  body('content').notEmpty().isLength({ min: 1, max: 1000 }).withMessage('Comment content is required and must be between 1-1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { postId } = req.params;
    const { content } = req.body;
    const user = req.user;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Content moderation for comment
    const moderationService = new ContentModerationService();
    const moderationResult = await moderationService.moderateContent(content);

    const comment = {
      user: user._id,
      userModel: user.constructor.modelName,
      content,
      moderationResult: {
        aiFlag: moderationResult.flag,
        aiTimestamp: new Date()
      },
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    // Notify author if it's not their own post
    if (!post.author.equals(user._id)) {
      const authorModel = post.authorModel;
      let author;

      if (authorModel === 'Student') {
        author = await Student.findById(post.author);
      } else if (authorModel === 'Teacher') {
        author = await Teacher.findById(post.author);
      }

      if (author) {
        author.addNotification(
          'comment',
          `${user.profile.name} commented on your post`,
          {
            relatedPost: post._id,
            relatedUser: user._id,
            relatedUserModel: user.constructor.modelName
          }
        );
        await author.save();
      }
    }

    // Populate the comment user info
    await post.populate('comments.user', 'profile.name profile.avatar');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: post.comments[post.comments.length - 1],
        commentsCount: post.comments.length
      }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment'
    });
  }
});

// Delete a post
router.delete('/:postId', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.user;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author or school admin
    const isAuthor = post.author.equals(user._id);
    const isSchoolAdmin = user.constructor.modelName === 'School' && post.school.equals(user._id);

    if (!isAuthor && !isSchoolAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await Post.findByIdAndDelete(postId);

    // Remove from school's flagged posts if it was flagged
    if (post.status === 'flagged') {
      const school = await School.findById(post.school);
      if (school) {
        school.flaggedPosts = school.flaggedPosts.filter(
          id => !id.equals(postId)
        );
        await school.save();
      }
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post'
    });
  }
});

// Search posts
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { category, postType } = req.query;

    let searchQuery = {
      status: 'approved',
      $or: [
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    };

    if (category) {
      searchQuery.category = category;
    }

    if (postType) {
      searchQuery.postType = postType;
    }

    const posts = await Post.find(searchQuery)
      .populate('author', 'profile.name profile.avatar enrollmentId email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments(searchQuery);

    res.json({
      success: true,
      data: {
        posts,
        totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        query
      }
    });

  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching posts'
    });
  }
});

// Get trending posts
router.get('/trending/posts', async (req, res) => {
  try {
    const { timeframe = '7' } = req.query; // days
    const days = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trendingPosts = await Post.aggregate([
      {
        $match: {
          status: 'approved',
          createdAt: { $gte: startDate }
        }
      },
      {
        $addFields: {
          engagementScore: {
            $add: [
              { $size: '$likes' },
              { $multiply: [{ $size: '$comments' }, 2] }, // Comments weight more
              { $divide: ['$views', 10] } // Views weight less
            ]
          }
        }
      },
      {
        $sort: { engagementScore: -1 }
      },
      {
        $limit: 20
      },
      {
        $lookup: {
          from: 'students',
          localField: 'author',
          foreignField: '_id',
          as: 'studentAuthor'
        }
      },
      {
        $lookup: {
          from: 'teachers',
          localField: 'author',
          foreignField: '_id',
          as: 'teacherAuthor'
        }
      },
      {
        $lookup: {
          from: 'schools',
          localField: 'author',
          foreignField: '_id',
          as: 'schoolAuthor'
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        trendingPosts,
        timeframe: `${days} days`
      }
    });

  } catch (error) {
    console.error('Get trending posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trending posts'
    });
  }
});

module.exports = router; 