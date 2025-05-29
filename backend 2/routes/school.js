const express = require('express');
const { body, validationResult } = require('express-validator');
const School = require('../models/School');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Post = require('../models/Post');
const { schoolOnly } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Get school dashboard
router.get('/dashboard', schoolOnly, async (req, res) => {
  try {
    const school = req.user;
    
    // Get registered students and teachers
    const registeredStudents = await Student.find({ school: school._id });
    const registeredTeachers = await Teacher.find({ school: school._id });
    
    // Get flagged posts
    const flaggedPosts = await Post.find({
      _id: { $in: school.flaggedPosts },
      status: 'flagged'
    }).populate('author', 'profile.name').sort({ createdAt: -1 });
    
    // Get recent posts from students/teachers
    const recentPosts = await Post.find({
      school: school._id,
      status: 'approved'
    }).populate('author', 'profile.name').sort({ createdAt: -1 }).limit(10);
    
    // Get school's own posts
    const schoolPosts = await Post.find({
      author: school._id,
      authorModel: 'School'
    }).sort({ createdAt: -1 }).limit(5);
    
    // Calculate engagement statistics
    const totalUsers = registeredStudents.length + registeredTeachers.length;
    const activeUsers = Math.floor(totalUsers * 0.75); // 75% activity simulation
    const engagementRate = Math.floor(Math.random() * 30) + 60; // 60-90% range
    
    // Calculate total posts and engagement
    const totalPosts = await Post.countDocuments({ school: school._id });
    const totalLikes = await Post.aggregate([
      { $match: { school: school._id } },
      { $project: { likesCount: { $size: '$likes' } } },
      { $group: { _id: null, total: { $sum: '$likesCount' } } }
    ]);
    
    const totalComments = await Post.aggregate([
      { $match: { school: school._id } },
      { $project: { commentsCount: { $size: '$comments' } } },
      { $group: { _id: null, total: { $sum: '$commentsCount' } } }
    ]);

    res.json({
      success: true,
      data: {
        profile: school.profile,
        stats: {
          totalUsers,
          activeUsers,
          totalStudents: registeredStudents.length,
          totalTeachers: registeredTeachers.length,
          pendingStudents: school.students.length - registeredStudents.length,
          pendingTeachers: school.teachers.length - registeredTeachers.length,
          engagementRate,
          totalPosts,
          totalLikes: totalLikes[0]?.total || 0,
          totalComments: totalComments[0]?.total || 0,
          flaggedPostsCount: flaggedPosts.length
        },
        flaggedPosts,
        recentPosts,
        schoolPosts,
        students: registeredStudents.map(s => ({
          id: s._id,
          name: s.profile.name,
          enrollmentId: s.enrollmentId,
          class: s.profile.class,
          phoneNumber: s.phoneNumber,
          isActive: s.isActive
        })),
        teachers: registeredTeachers.map(t => ({
          id: t._id,
          name: t.profile.name,
          email: t.email,
          department: t.profile.department,
          experience: t.profile.experience,
          isActive: t.isActive
        }))
      }
    });

  } catch (error) {
    console.error('School dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// Create student
router.post('/create-student', [
  schoolOnly,
  body('phoneNumber').isMobilePhone().withMessage('Valid phone number is required'),
  body('enrollmentId').notEmpty().withMessage('Enrollment ID is required')
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

    const { phoneNumber, enrollmentId } = req.body;
    const school = req.user;

    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ phoneNumber }, { enrollmentId }]
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this phone number or enrollment ID already exists'
      });
    }

    // Check if already in school's student list
    const existingInSchool = school.students.find(s => 
      s.phoneNumber === phoneNumber || s.enrollmentId === enrollmentId
    );

    if (existingInSchool) {
      return res.status(400).json({
        success: false,
        message: 'Student already exists in school records'
      });
    }

    // Add to school's student list
    school.students.push({
      enrollmentId,
      phoneNumber,
      isRegistered: false
    });

    await school.save();

    res.json({
      success: true,
      message: 'Student record created successfully',
      data: {
        enrollmentId,
        phoneNumber
      }
    });

  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating student record'
    });
  }
});

// Create teacher
router.post('/create-teacher', [
  schoolOnly,
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Teacher name is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('experience').isNumeric().withMessage('Experience must be a number')
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

    const { email, password, name, department, experience } = req.body;
    const school = req.user;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email: email.toLowerCase() });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this email already exists'
      });
    }

    // Create teacher account
    const teacher = new Teacher({
      email: email.toLowerCase(),
      password,
      school: school._id,
      profile: {
        name,
        department,
        experience: parseInt(experience),
        isProfileComplete: true
      }
    });

    await teacher.save();

    // Add to school's teacher list
    school.teachers.push({
      email: teacher.email,
      password, // Will be hashed by school model
      name: teacher.profile.name,
      department: teacher.profile.department,
      experience: teacher.profile.experience,
      isRegistered: true,
      teacherId: teacher._id
    });

    school.profile.totalTeachers += 1;
    await school.save();

    res.json({
      success: true,
      message: 'Teacher created successfully',
      data: {
        id: teacher._id,
        email: teacher.email,
        name: teacher.profile.name,
        department: teacher.profile.department,
        experience: teacher.profile.experience
      }
    });

  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating teacher account'
    });
  }
});

// Get all students
router.get('/students', schoolOnly, async (req, res) => {
  try {
    const school = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const students = await Student.find({ school: school._id })
      .select('enrollmentId phoneNumber profile isActive createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalStudents = await Student.countDocuments({ school: school._id });

    res.json({
      success: true,
      data: {
        students,
        totalStudents,
        currentPage: page,
        totalPages: Math.ceil(totalStudents / limit)
      }
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students'
    });
  }
});

// Get all teachers
router.get('/teachers', schoolOnly, async (req, res) => {
  try {
    const school = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const teachers = await Teacher.find({ school: school._id })
      .select('email profile isActive createdAt stats')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTeachers = await Teacher.countDocuments({ school: school._id });

    res.json({
      success: true,
      data: {
        teachers,
        totalTeachers,
        currentPage: page,
        totalPages: Math.ceil(totalTeachers / limit)
      }
    });

  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers'
    });
  }
});

// Get flagged posts
router.get('/flagged-posts', schoolOnly, async (req, res) => {
  try {
    const school = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const flaggedPosts = await Post.find({
      school: school._id,
      status: 'flagged'
    })
    .populate('author', 'profile.name profile.avatar enrollmentId email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const totalFlagged = await Post.countDocuments({
      school: school._id,
      status: 'flagged'
    });

    res.json({
      success: true,
      data: {
        posts: flaggedPosts,
        totalPosts: totalFlagged,
        currentPage: page,
        totalPages: Math.ceil(totalFlagged / limit)
      }
    });

  } catch (error) {
    console.error('Get flagged posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching flagged posts'
    });
  }
});

// Approve/Reject flagged post
router.patch('/posts/:postId/moderate', [
  schoolOnly,
  body('action').isIn(['approve', 'reject']).withMessage('Action must be approve or reject')
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
    const { action } = req.body;
    const school = req.user;

    const post = await Post.findOne({
      _id: postId,
      school: school._id,
      status: 'flagged'
    }).populate('author');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Flagged post not found'
      });
    }

    // Update post status
    post.status = action === 'approve' ? 'approved' : 'rejected';
    post.moderationResult.schoolApproval = action === 'approve';
    post.moderationResult.schoolApprovalTimestamp = new Date();
    post.moderationResult.approvedBy = school._id;

    await post.save();

    // Remove from school's flagged posts
    school.flaggedPosts = school.flaggedPosts.filter(
      id => id.toString() !== postId
    );
    await school.save();

    // Notify author
    if (post.authorModel === 'Student') {
      const student = await Student.findById(post.author._id);
      if (student) {
        student.addNotification(
          action === 'approve' ? 'post_approved' : 'post_flagged',
          `Your post has been ${action}d by the school`,
          { relatedPost: post._id }
        );
        await student.save();
      }
    } else if (post.authorModel === 'Teacher') {
      const teacher = await Teacher.findById(post.author._id);
      if (teacher) {
        teacher.addNotification(
          action === 'approve' ? 'post_approved' : 'post_flagged',
          `Your post has been ${action}d by the school`,
          { relatedPost: post._id }
        );
        await teacher.save();
      }
    }

    res.json({
      success: true,
      message: `Post ${action}d successfully`,
      data: {
        postId,
        status: post.status
      }
    });

  } catch (error) {
    console.error('Moderate post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error moderating post'
    });
  }
});

// Delete post
router.delete('/posts/:postId', schoolOnly, async (req, res) => {
  try {
    const { postId } = req.params;
    const school = req.user;

    const post = await Post.findOne({
      _id: postId,
      school: school._id
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await Post.findByIdAndDelete(postId);

    // Remove from school's flagged posts if it was flagged
    school.flaggedPosts = school.flaggedPosts.filter(
      id => id.toString() !== postId
    );
    await school.save();

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

// Create school post
router.post('/posts', [
  schoolOnly,
  body('content').notEmpty().withMessage('Content is required'),
  body('postType').isIn(['notice', 'announcement']).withMessage('Post type must be notice or announcement'),
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

    const { content, postType, category, media } = req.body;
    const school = req.user;

    const post = new Post({
      content,
      author: school._id,
      authorModel: 'School',
      school: school._id,
      postType,
      category: category || postType,
      media: media || [],
      status: 'approved', // School posts are auto-approved
      moderationResult: {
        aiFlag: 'Green Flag',
        aiTimestamp: new Date(),
        schoolApproval: true,
        schoolApprovalTimestamp: new Date(),
        approvedBy: school._id
      }
    });

    await post.save();

    // Add to school's posts
    school.schoolPosts.push(post._id);
    await school.save();

    res.json({
      success: true,
      message: 'Post created successfully',
      data: post
    });

  } catch (error) {
    console.error('Create school post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post'
    });
  }
});

// Get school analytics
router.get('/analytics', schoolOnly, async (req, res) => {
  try {
    const school = req.user;
    const { timeframe = '30' } = req.query;
    const days = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Post analytics
    const postStats = await Post.aggregate([
      {
        $match: {
          school: school._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          posts: { $sum: 1 },
          likes: { $sum: { $size: "$likes" } },
          comments: { $sum: { $size: "$comments" } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // User engagement
    const studentCount = await Student.countDocuments({ school: school._id });
    const teacherCount = await Teacher.countDocuments({ school: school._id });
    const activeStudents = await Student.countDocuments({
      school: school._id,
      lastLogin: { $gte: startDate }
    });

    // Algorithm for engagement prediction
    const engagementRate = studentCount > 0 ? (activeStudents / studentCount) * 100 : 0;
    const averagePostsPerDay = postStats.reduce((sum, stat) => sum + stat.posts, 0) / days;
    const averageLikesPerPost = postStats.reduce((sum, stat) => sum + stat.likes, 0) / 
                               postStats.reduce((sum, stat) => sum + stat.posts, 0) || 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers: studentCount + teacherCount,
          activeUsers: activeStudents,
          engagementRate: Math.round(engagementRate),
          averagePostsPerDay: Math.round(averagePostsPerDay * 10) / 10,
          averageLikesPerPost: Math.round(averageLikesPerPost * 10) / 10
        },
        postStats,
        algorithms: {
          engagement: "Active users / Total users * 100",
          activity: "Posts + Comments + Likes / Total users",
          growth: "New users this period / Previous period * 100"
        }
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
});

module.exports = router; 