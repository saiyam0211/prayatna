const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const Post = require('../models/Post');
const School = require('../models/School');
const { studentOnly, requireCompleteProfile, createContentLimit } = require('../middleware/auth');
const ContentModerationService = require('../services/contentModeration');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/achievements/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get student dashboard
router.get('/dashboard', studentOnly, async (req, res) => {
  try {
    const student = req.user;
    
    // Update streak
    student.updateStreak();
    await student.save();
    
    // Get feed posts
    const feedPosts = await Post.getFeedPosts(student, 'Student', 1, 10);
    
    // Get motivational quote if streak is 0
    const motivationalQuote = student.streak.currentStreak === 0 
      ? student.getMotivationalQuote() 
      : null;

    // Get student's own posts
    const myPosts = await Post.find({
      author: student._id,
      authorModel: 'Student'
    }).sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        profile: {
          name: student.profile.name,
          class: student.profile.class,
          section: student.profile.section,
          hobbies: student.profile.hobbies || [],
          interests: student.profile.interests || [],
          currentGoals: student.profile.currentGoals || [],
          avatar: student.profile.avatar,
          isProfileComplete: student.profile.isProfileComplete
        },
        skillMarks: student.skillMarks,
        streak: student.streak,
        motivationalQuote,
        achievements: student.achievements.slice(-6), // Last 6 achievements
        feedPosts,
        myPosts,
        notifications: student.notifications.slice(0, 10), // Latest 10 notifications
        stats: {
          totalAchievements: student.achievements.length,
          unreadNotifications: student.notifications.filter(n => !n.isRead).length,
          totalPosts: myPosts.length
        }
      }
    });

  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// Check profile completion status
router.get('/profile/completion-status', studentOnly, async (req, res) => {
  try {
    const student = req.user;
    const isComplete = student.checkProfileComplete();
    
    res.json({
      success: true,
      data: {
        isProfileComplete: isComplete,
        completedFields: {
          name: !!student.profile.name,
          class: !!student.profile.class,
          dateOfBirth: !!student.profile.dateOfBirth,
          gender: !!student.profile.gender,
          hobbies: !!(student.profile.hobbies && student.profile.hobbies.length > 0),
          currentGoals: !!(student.profile.currentGoals && student.profile.currentGoals.length > 0)
        },
        missingFields: []
      }
    });

  } catch (error) {
    console.error('Profile completion check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking profile completion'
    });
  }
});

// Complete/Update profile
router.put('/profile/complete', [
  studentOnly,
  body('name').notEmpty().withMessage('Name is required'),
  body('class').notEmpty().withMessage('Class is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
  body('hobbies').isArray({ min: 1 }).withMessage('At least one hobby is required'),
  body('currentGoals').isArray({ min: 1 }).withMessage('At least one goal is required')
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

    const student = req.user;
    const { 
      name, 
      class: studentClass, 
      section,
      dateOfBirth, 
      gender, 
      hobbies, 
      interests,
      currentGoals,
      address
    } = req.body;

    // Update profile
    student.profile.name = name;
    student.profile.class = studentClass;
    student.profile.section = section;
    student.profile.dateOfBirth = new Date(dateOfBirth);
    student.profile.gender = gender;
    student.profile.hobbies = hobbies;
    student.profile.interests = interests || [];
    student.profile.currentGoals = currentGoals;
    
    if (address) {
      student.profile.address = address;
    }

    // Check if profile is complete
    student.checkProfileComplete();
    
    await student.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: student.profile,
        isProfileComplete: student.profile.isProfileComplete
      }
    });

  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// Add achievement
router.post('/achievements', [
  studentOnly,
  upload.array('media', 5),
  body('title').notEmpty().withMessage('Achievement title is required'),
  body('emoji').notEmpty().withMessage('Emoji is required'),
  body('year').isNumeric().withMessage('Year must be a number'),
  body('description').notEmpty().withMessage('Description is required')
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

    const student = req.user;
    const { title, emoji, year, description } = req.body;
    
    // Handle uploaded media
    const mediaUrls = req.files ? req.files.map(file => `/uploads/achievements/${file.filename}`) : [];

    const achievementData = {
      title,
      emoji,
      year: parseInt(year),
      description,
      media: mediaUrls
    };

    const achievement = student.addAchievement(achievementData);
    await student.save();

    res.json({
      success: true,
      message: 'Achievement added successfully',
      data: achievement
    });

  } catch (error) {
    console.error('Add achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding achievement'
    });
  }
});

// Get achievement details
router.get('/achievements/:achievementId', studentOnly, async (req, res) => {
  try {
    const student = req.user;
    const { achievementId } = req.params;

    const achievement = student.achievements.id(achievementId);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      data: achievement
    });

  } catch (error) {
    console.error('Get achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement'
    });
  }
});

// Upload marksheet
router.post('/education/marksheet', [
  studentOnly,
  body('class').notEmpty().withMessage('Class is required'),
  body('year').isNumeric().withMessage('Year is required'),
  body('subjects').isArray({ min: 1 }).withMessage('At least one subject is required'),
  body('subjects.*.name').notEmpty().withMessage('Subject name is required'),
  body('subjects.*.marks').isNumeric().withMessage('Marks must be numeric'),
  body('subjects.*.totalMarks').isNumeric().withMessage('Total marks must be numeric')
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

    const student = req.user;
    const { class: marksheetClass, year, subjects, totalMarks, percentage } = req.body;

    // Add marksheet to education
    const marksheetData = {
      class: marksheetClass,
      year: parseInt(year),
      subjects: subjects.map(s => ({
        name: s.name,
        marks: parseInt(s.marks),
        totalMarks: parseInt(s.totalMarks),
        grade: s.grade || ''
      })),
      totalMarks: totalMarks || subjects.reduce((sum, s) => sum + parseInt(s.totalMarks), 0),
      percentage: percentage || ((subjects.reduce((sum, s) => sum + parseInt(s.marks), 0) / 
                                 subjects.reduce((sum, s) => sum + parseInt(s.totalMarks), 0)) * 100)
    };

    student.education.marksheets.push(marksheetData);
    
    // Process marksheets to update skill marks
    await student.processMarksheets();
    await student.save();

    res.json({
      success: true,
      message: 'Marksheet uploaded and processed successfully',
      data: {
        marksheet: marksheetData,
        skillMarks: student.skillMarks
      }
    });

  } catch (error) {
    console.error('Upload marksheet error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading marksheet'
    });
  }
});

// Get notifications
router.get('/notifications', studentOnly, async (req, res) => {
  try {
    const student = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = student.notifications
      .slice(skip, skip + limit)
      .map(notification => ({
        ...notification.toObject(),
        timeAgo: getTimeAgo(notification.createdAt)
      }));

    const unreadCount = student.notifications.filter(n => !n.isRead).length;

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        totalNotifications: student.notifications.length,
        currentPage: page,
        totalPages: Math.ceil(student.notifications.length / limit)
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
});

// Mark notification as read
router.patch('/notifications/:notificationId/read', studentOnly, async (req, res) => {
  try {
    const student = req.user;
    const { notificationId } = req.params;

    const notification = student.notifications.id(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    await student.save();

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification'
    });
  }
});

// Mark all notifications as read
router.patch('/notifications/read-all', studentOnly, async (req, res) => {
  try {
    const student = req.user;

    student.notifications.forEach(notification => {
      notification.isRead = true;
    });

    await student.save();

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notifications'
    });
  }
});

// Get student's posts
router.get('/posts', studentOnly, async (req, res) => {
  try {
    const student = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      author: student._id,
      authorModel: 'Student'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('comments.user', 'profile.name profile.avatar');

    const totalPosts = await Post.countDocuments({
      author: student._id,
      authorModel: 'Student'
    });

    res.json({
      success: true,
      data: {
        posts,
        totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit)
      }
    });

  } catch (error) {
    console.error('Get student posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts'
    });
  }
});

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

module.exports = router; 