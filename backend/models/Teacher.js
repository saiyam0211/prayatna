const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
  // Authentication fields (from school registration)
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // School reference
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  
  // Profile information (pre-filled from school data)
  profile: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    avatar: String,
    department: {
      type: String,
      required: true,
      trim: true
    },
    experience: {
      type: Number,
      required: true,
      min: 0
    },
    designation: {
      type: String,
      enum: ['Teacher', 'Senior Teacher', 'Head of Department', 'Assistant Principal', 'Principal'],
      default: 'Teacher'
    },
    employeeId: String,
    joiningDate: {
      type: Date,
      default: Date.now
    },
    
    // Optional profile fields
    specialization: [String],
    qualifications: [String],
    classesTeaching: [String], // e.g., ['Class 9A', 'Class 10B']
    subjectsTeaching: [String], // e.g., ['Mathematics', 'Physics']
    
    // Contact information
    phone: String,
    alternateEmail: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    
    // Professional details
    previousExperience: [{
      school: String,
      position: String,
      duration: String,
      subjects: [String]
    }],
    
    // Personal information
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    
    isProfileComplete: {
      type: Boolean,
      default: true // Pre-filled by school
    },
    bio: String
  },
  
  // Teaching data
  classes: [{
    class: String,
    section: String,
    subject: String
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  
  // Posts and activities
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  
  // Events created by teacher
  events: [{
    title: String,
    description: String,
    date: Date,
    time: String,
    location: String,
    attendees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }],
    category: {
      type: String,
      enum: ['meeting', 'class', 'event', 'training', 'workshop'],
      default: 'meeting'
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Performance metrics
  performance: {
    totalStudents: {
      type: Number,
      default: 0
    },
    totalPosts: {
      type: Number,
      default: 0
    },
    totalEvents: {
      type: Number,
      default: 0
    },
    studentRatings: [{
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      feedback: String,
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }],
    averageRating: {
      type: Number,
      default: 0
    }
  },
  
  // Achievements and recognitions
  achievements: [{
    title: String,
    description: String,
    date: Date,
    category: {
      type: String,
      enum: ['teaching', 'research', 'student_success', 'innovation', 'leadership'],
      default: 'teaching'
    },
    media: [String] // URLs to certificates/images
  }],
  
  // Notifications
  notifications: [{
    type: {
      type: String,
      enum: ['like', 'comment', 'follow', 'post_approved', 'post_flagged', 'student_achievement'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    relatedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'notifications.relatedUserModel'
    },
    relatedUserModel: {
      type: String,
      enum: ['Student', 'Teacher', 'School']
    },
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  
  // Settings
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    studentPostNotifications: {
      type: Boolean,
      default: true
    },
    eventReminders: {
      type: Boolean,
      default: true
    }
  },
  
  // Followers and following
  followers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'followers.userModel'
    },
    userModel: {
      type: String,
      enum: ['Student', 'Teacher']
    }
  }],
  following: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'following.userModel'
    },
    userModel: {
      type: String,
      enum: ['Student', 'Teacher']
    }
  }],
  
  // Stats
  stats: {
    totalPosts: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    },
    totalComments: {
      type: Number,
      default: 0
    }
  }
  
}, {
  timestamps: true
});

// Hash password before saving
teacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
teacherSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add notification
teacherSchema.methods.addNotification = function(type, message, relatedData = {}) {
  this.notifications.unshift({
    type,
    message,
    ...relatedData,
    createdAt: new Date()
  });
  
  // Keep only last 50 notifications
  if (this.notifications.length > 50) {
    this.notifications = this.notifications.slice(0, 50);
  }
};

// Update performance metrics
teacherSchema.methods.updatePerformance = function() {
  this.performance.totalStudents = this.students.length;
  this.performance.totalPosts = this.posts.length;
  this.performance.totalEvents = this.events.length;
  
  // Calculate average rating
  if (this.performance.studentRatings.length > 0) {
    const totalRating = this.performance.studentRatings.reduce((sum, rating) => sum + rating.rating, 0);
    this.performance.averageRating = totalRating / this.performance.studentRatings.length;
  }
};

// Create event
teacherSchema.methods.createEvent = function(eventData) {
  const event = {
    title: eventData.title,
    description: eventData.description,
    date: eventData.date,
    time: eventData.time,
    location: eventData.location,
    category: eventData.category || 'meeting',
    attendees: eventData.attendees || []
  };
  
  this.events.push(event);
  this.updatePerformance();
  
  return this.events[this.events.length - 1];
};

// Get upcoming events
teacherSchema.methods.getUpcomingEvents = function() {
  const now = new Date();
  return this.events.filter(event => 
    new Date(event.date) >= now && !event.isCompleted
  ).sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Get completed events
teacherSchema.methods.getCompletedEvents = function() {
  return this.events.filter(event => 
    event.isCompleted || new Date(event.date) < new Date()
  ).sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Update stats method
teacherSchema.methods.updateStats = async function() {
  const Post = require('./Post');
  
  try {
    const posts = await Post.find({ author: this._id, authorModel: 'Teacher' });
    
    this.stats.totalPosts = posts.length;
    this.stats.totalLikes = posts.reduce((total, post) => total + post.likes.length, 0);
    this.stats.totalComments = posts.reduce((total, post) => total + post.comments.length, 0);
    
    await this.save();
  } catch (error) {
    console.error('Error updating teacher stats:', error);
  }
};

module.exports = mongoose.model('Teacher', teacherSchema); 