const express = require('express');
const { body, validationResult } = require('express-validator');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Post = require('../models/Post');
const School = require('../models/School');
const { teacherOnly } = require('../middleware/auth');

const router = express.Router();

// Get teacher dashboard
router.get('/dashboard', teacherOnly, async (req, res) => {
  try {
    const teacher = req.user;
    
    // Get feed posts
    const feedPosts = await Post.getFeedPosts(teacher, 'Teacher', 1, 10);
    
    // Get teacher's own posts
    const myPosts = await Post.find({
      author: teacher._id,
      authorModel: 'Teacher'
    }).sort({ createdAt: -1 }).limit(5);

    // Get students from the same school
    const schoolStudents = await Student.find({ 
      school: teacher.school,
      'profile.isProfileComplete': true
    }).select('profile.name profile.class enrollmentId').limit(10);

    // Get teacher stats
    await teacher.updateStats();

    res.json({
      success: true,
      data: {
        profile: {
          name: teacher.profile.name,
          department: teacher.profile.department,
          experience: teacher.profile.experience,
          email: teacher.email,
          bio: teacher.profile.bio,
          subjects: teacher.profile.subjects || [],
          qualifications: teacher.profile.qualifications || [],
          avatar: teacher.profile.avatar,
          isProfileComplete: teacher.profile.isProfileComplete
        },
        stats: teacher.stats,
        classes: teacher.classes,
        students: schoolStudents,
        feedPosts,
        myPosts,
        notifications: teacher.notifications.slice(0, 10),
        teacherStats: {
          totalStudents: schoolStudents.length,
          totalClasses: teacher.classes.length,
          unreadNotifications: teacher.notifications.filter(n => !n.isRead).length
        }
      }
    });

  } catch (error) {
    console.error('Teacher dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// Update teacher profile
router.put('/profile', [
  teacherOnly,
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('subjects').optional().isArray().withMessage('Subjects must be an array'),
  body('qualifications').optional().isArray().withMessage('Qualifications must be an array'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required')
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

    const teacher = req.user;
    const { bio, subjects, qualifications, phone, avatar, address } = req.body;

    // Update optional profile fields
    if (bio !== undefined) teacher.profile.bio = bio;
    if (subjects !== undefined) teacher.profile.subjects = subjects;
    if (qualifications !== undefined) teacher.profile.qualifications = qualifications;
    if (phone !== undefined) teacher.profile.phone = phone;
    if (avatar !== undefined) teacher.profile.avatar = avatar;
    if (address !== undefined) teacher.profile.address = address;

    await teacher.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: teacher.profile
      }
    });

  } catch (error) {
    console.error('Update teacher profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// Get teacher's students
router.get('/students', teacherOnly, async (req, res) => {
  try {
    const teacher = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { class: filterClass, search } = req.query;

    let query = { school: teacher.school };
    
    // Filter by class if provided
    if (filterClass) {
      query['profile.class'] = filterClass;
    }
    
    // Search by name or enrollment ID
    if (search) {
      query.$or = [
        { 'profile.name': { $regex: search, $options: 'i' } },
        { enrollmentId: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .select('enrollmentId profile.name profile.class profile.avatar streak.currentStreak skillMarks isActive')
      .sort({ 'profile.name': 1 })
      .skip(skip)
      .limit(limit);

    const totalStudents = await Student.countDocuments(query);

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
    console.error('Get teacher students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students'
    });
  }
});

// Add/Update class assignment
router.post('/classes', [
  teacherOnly,
  body('class').notEmpty().withMessage('Class is required'),
  body('section').notEmpty().withMessage('Section is required'),
  body('subject').notEmpty().withMessage('Subject is required')
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

    const teacher = req.user;
    const { class: className, section, subject } = req.body;

    // Check if class assignment already exists
    const existingClass = teacher.classes.find(
      c => c.class === className && c.section === section && c.subject === subject
    );

    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: 'Class assignment already exists'
      });
    }

    teacher.classes.push({
      class: className,
      section: section,
      subject: subject
    });

    await teacher.save();

    res.json({
      success: true,
      message: 'Class assignment added successfully',
      data: {
        classes: teacher.classes
      }
    });

  } catch (error) {
    console.error('Add class error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding class assignment'
    });
  }
});

// Remove class assignment
router.delete('/classes/:classId', teacherOnly, async (req, res) => {
  try {
    const teacher = req.user;
    const { classId } = req.params;

    const classAssignment = teacher.classes.id(classId);
    if (!classAssignment) {
      return res.status(404).json({
        success: false,
        message: 'Class assignment not found'
      });
    }

    teacher.classes.id(classId).remove();
    await teacher.save();

    res.json({
      success: true,
      message: 'Class assignment removed successfully'
    });

  } catch (error) {
    console.error('Remove class error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing class assignment'
    });
  }
});

// Get teacher's posts
router.get('/posts', teacherOnly, async (req, res) => {
  try {
    const teacher = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      author: teacher._id,
      authorModel: 'Teacher'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('comments.user', 'profile.name profile.avatar');

    const totalPosts = await Post.countDocuments({
      author: teacher._id,
      authorModel: 'Teacher'
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
    console.error('Get teacher posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts'
    });
  }
});

// Get teacher notifications
router.get('/notifications', teacherOnly, async (req, res) => {
  try {
    const teacher = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = teacher.notifications
      .slice(skip, skip + limit)
      .map(notification => ({
        ...notification.toObject(),
        timeAgo: getTimeAgo(notification.createdAt)
      }));

    const unreadCount = teacher.notifications.filter(n => !n.isRead).length;

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        totalNotifications: teacher.notifications.length,
        currentPage: page,
        totalPages: Math.ceil(teacher.notifications.length / limit)
      }
    });

  } catch (error) {
    console.error('Get teacher notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
});

// Mark notification as read
router.patch('/notifications/:notificationId/read', teacherOnly, async (req, res) => {
  try {
    const teacher = req.user;
    const { notificationId } = req.params;

    const notification = teacher.notifications.id(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    await teacher.save();

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark teacher notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification'
    });
  }
});

// Mark all notifications as read
router.patch('/notifications/read-all', teacherOnly, async (req, res) => {
  try {
    const teacher = req.user;

    teacher.notifications.forEach(notification => {
      notification.isRead = true;
    });

    await teacher.save();

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all teacher notifications read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notifications'
    });
  }
});

// Get teacher analytics
router.get('/analytics', teacherOnly, async (req, res) => {
  try {
    const teacher = req.user;
    const { timeframe = '30' } = req.query;
    const days = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Post analytics
    const postStats = await Post.aggregate([
      {
        $match: {
          author: teacher._id,
          authorModel: 'Teacher',
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

    // Student engagement with teacher's posts
    const studentEngagement = await Student.countDocuments({
      school: teacher.school,
      lastLogin: { $gte: startDate }
    });

    const totalSchoolStudents = await Student.countDocuments({
      school: teacher.school
    });

    const averagePostsPerDay = postStats.reduce((sum, stat) => sum + stat.posts, 0) / days;
    const averageLikesPerPost = postStats.reduce((sum, stat) => sum + stat.likes, 0) / 
                               postStats.reduce((sum, stat) => sum + stat.posts, 0) || 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalPosts: teacher.stats.totalPosts,
          totalLikes: teacher.stats.totalLikes,
          totalComments: teacher.stats.totalComments,
          studentEngagement: Math.round((studentEngagement / totalSchoolStudents) * 100),
          averagePostsPerDay: Math.round(averagePostsPerDay * 10) / 10,
          averageLikesPerPost: Math.round(averageLikesPerPost * 10) / 10
        },
        postStats,
        classes: teacher.classes
      }
    });

  } catch (error) {
    console.error('Teacher analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
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