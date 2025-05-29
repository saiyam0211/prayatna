const jwt = require('jsonwebtoken');
const School = require('../models/School');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// General authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    if (decoded.role === 'school') {
      user = await School.findById(decoded.id).select('-password');
    } else if (decoded.role === 'student') {
      user = await Student.findById(decoded.id).populate('school', 'profile.name schoolId').select('-password');
    } else if (decoded.role === 'teacher') {
      user = await Teacher.findById(decoded.id).populate('school', 'profile.name schoolId').select('-password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    // Set user data - keep it as Mongoose document for methods
    req.user = user;
    req.userRole = decoded.role;
    req.schoolId = decoded.schoolId;
    next();

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

// School-only middleware
const schoolOnly = [authenticate, authorize('school')];

// Student-only middleware
const studentOnly = [authenticate, authorize('student')];

// Teacher-only middleware
const teacherOnly = [authenticate, authorize('teacher')];

// Student or Teacher middleware
const studentOrTeacher = [authenticate, authorize('student', 'teacher')];

// Any authenticated user middleware
const anyAuth = authenticate;

// School staff (school or teacher) middleware
const schoolStaff = [authenticate, authorize('school', 'teacher')];

// Same school verification middleware
const sameSchool = async (req, res, next) => {
  try {
    // This middleware should be used after authenticate
    if (!req.user || !req.schoolId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Extract school ID from request parameters or body
    const targetSchoolId = req.params.schoolId || req.body.schoolId;
    
    if (targetSchoolId && targetSchoolId !== req.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your school\'s data.'
      });
    }

    next();
  } catch (error) {
    console.error('Same school verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying school access'
    });
  }
};

// Profile completion check middleware
const requireCompleteProfile = async (req, res, next) => {
  try {
    if (req.userRole === 'student' && !req.user.profile.isProfileComplete) {
      return res.status(403).json({
        success: false,
        message: 'Please complete your profile first',
        requiresProfileCompletion: true
      });
    }
    next();
  } catch (error) {
    console.error('Profile completion check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking profile completion'
    });
  }
};

// Check if user can access specific post
const canAccessPost = async (req, res, next) => {
  try {
    const Post = require('../models/Post');
    const postId = req.params.postId || req.params.id;
    
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required'
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user can see this post based on visibility settings
    const canSee = post.canBeSeenBy(req.user, req.userRole);
    
    if (!canSee) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this post'
      });
    }

    req.post = post;
    next();
  } catch (error) {
    console.error('Post access check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking post access'
    });
  }
};

// Rate limiting for content creation
const createContentLimit = (maxPosts = 10) => {
  return async (req, res, next) => {
    try {
      if (req.userRole === 'student') {
        const Post = require('../models/Post');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayPostsCount = await Post.countDocuments({
          'author.id': req.user._id,
          'author.model': 'Student',
          createdAt: { $gte: today }
        });

        if (todayPostsCount >= maxPosts) {
          return res.status(429).json({
            success: false,
            message: `You can only create ${maxPosts} posts per day`
          });
        }
      }
      next();
    } catch (error) {
      console.error('Content creation limit error:', error);
      next(); // Don't block on error, just log it
    }
  };
};

module.exports = {
  authenticate,
  authorize,
  schoolOnly,
  studentOnly,
  teacherOnly,
  studentOrTeacher,
  anyAuth,
  schoolStaff,
  sameSchool,
  requireCompleteProfile,
  canAccessPost,
  createContentLimit
}; 