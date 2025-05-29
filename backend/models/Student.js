const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  emoji: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  media: [{
    type: String, // URLs
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const marksheetSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true
  },
  subjects: [{
    name: String,
    marks: Number,
    totalMarks: Number,
    grade: String
  }],
  totalMarks: Number,
  percentage: Number,
  year: Number,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const studentSchema = new mongoose.Schema({
  enrollmentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  profile: {
    name: {
      type: String,
      trim: true
    },
    class: String,
    section: String,
    rollNumber: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    parentContact: {
      fatherName: String,
      motherName: String,
      parentPhone: String,
      parentEmail: String
    },
    avatar: String,
    hobbies: [String],
    interests: [String],
    currentGoals: [String],
    isProfileComplete: {
      type: Boolean,
      default: false
    }
  },
  achievements: [achievementSchema],
  education: {
    marksheets: {
      type: [marksheetSchema],
      default: []
    },
    lastProcessed: {
      type: Date,
      default: null
    }
  },
  skillMarks: {
    mathematics: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    english: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    science: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  streak: {
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastActiveDate: Date
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
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
  notifications: [{
    type: {
      type: String,
      enum: ['like', 'comment', 'follow', 'achievement', 'post_approved', 'post_flagged'],
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
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
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
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update streak method
studentSchema.methods.updateStreak = function() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Initialize streak if not exists
  if (!this.streak) {
    this.streak = {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null
    };
  }
  
  if (!this.streak.lastActiveDate) {
    this.streak.currentStreak = 1;
    this.streak.longestStreak = Math.max(this.streak.longestStreak || 0, 1);
    this.streak.lastActiveDate = today;
  } else {
    const lastActive = new Date(this.streak.lastActiveDate);
    const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
    const daysDiff = Math.floor((today - lastActiveDay) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day, no change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day
      this.streak.currentStreak = (this.streak.currentStreak || 0) + 1;
      this.streak.lastActiveDate = today;
    } else {
      // Streak broken
      this.streak.currentStreak = 1;
      this.streak.lastActiveDate = today;
    }
  }
  
  // Update longest streak if necessary
  if (this.streak.currentStreak > (this.streak.longestStreak || 0)) {
    this.streak.longestStreak = this.streak.currentStreak;
  }
};

// Get motivational quote for streak 0
studentSchema.methods.getMotivationalQuote = function() {
  const quotes = [
    "Every expert was once a beginner. Start your journey today! 🌟",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. 💪",
    "The only way to do great work is to love what you do. ❤️",
    "Learning never exhausts the mind. Keep going! 🧠",
    "Today is a new opportunity to grow and learn! 🌱",
    "Small steps every day lead to big changes! 👣",
    "Your potential is endless. Start unlocking it today! 🔓",
    "Every morning is a fresh start. Make it count! ☀️"
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};

// Add achievement method
studentSchema.methods.addAchievement = function(achievementData) {
  this.achievements.push(achievementData);
  
  // Create notification for achievement
  this.notifications.push({
    type: 'achievement',
    message: `Congratulations! You've added a new achievement: ${achievementData.title}`,
    createdAt: new Date()
  });
  
  return this.achievements[this.achievements.length - 1];
};

// Process marksheets with AI (placeholder for Python integration)
studentSchema.methods.processMarksheets = async function() {
  try {
    // Initialize education if not exists
    if (!this.education) {
      this.education = {
        marksheets: [],
        lastProcessed: null
      };
    }
    
    if (!this.education.marksheets || this.education.marksheets.length === 0) {
      return;
    }
    
    // Simple calculation based on last 3 marksheets
    const recentMarksheets = this.education.marksheets
      .sort((a, b) => b.year - a.year)
      .slice(0, 3);
    
    let mathTotal = 0, englishTotal = 0, scienceTotal = 0;
    let mathCount = 0, englishCount = 0, scienceCount = 0;
    
    recentMarksheets.forEach(marksheet => {
      if (marksheet.subjects && Array.isArray(marksheet.subjects)) {
        marksheet.subjects.forEach(subject => {
          if (subject.marks && subject.totalMarks && subject.totalMarks > 0) {
            const percentage = (subject.marks / subject.totalMarks) * 100;
            
            if (subject.name && subject.name.toLowerCase().includes('math')) {
              mathTotal += percentage;
              mathCount++;
            } else if (subject.name && subject.name.toLowerCase().includes('english')) {
              englishTotal += percentage;
              englishCount++;
            } else if (subject.name && (
              subject.name.toLowerCase().includes('science') || 
              subject.name.toLowerCase().includes('physics') ||
              subject.name.toLowerCase().includes('chemistry') ||
              subject.name.toLowerCase().includes('biology')
            )) {
              scienceTotal += percentage;
              scienceCount++;
            }
          }
        });
      }
    });
    
    // Initialize skillMarks if not exists
    if (!this.skillMarks) {
      this.skillMarks = {
        mathematics: 0,
        english: 0,
        science: 0,
        lastUpdated: new Date()
      };
    }
    
    // Update skill marks
    if (mathCount > 0) this.skillMarks.mathematics = Math.round(mathTotal / mathCount);
    if (englishCount > 0) this.skillMarks.english = Math.round(englishTotal / englishCount);
    if (scienceCount > 0) this.skillMarks.science = Math.round(scienceTotal / scienceCount);
    
    this.skillMarks.lastUpdated = new Date();
    this.education.lastProcessed = new Date();
    
  } catch (error) {
    console.error('Error processing marksheets:', error);
  }
};

// Check if profile is complete
studentSchema.methods.checkProfileComplete = function() {
  const required = ['name', 'class', 'dateOfBirth', 'gender'];
  const hasRequired = required.every(field => this.profile[field]);
  const hasHobbies = this.profile.hobbies && this.profile.hobbies.length > 0;
  const hasGoals = this.profile.currentGoals && this.profile.currentGoals.length > 0;
  
  this.profile.isProfileComplete = hasRequired && hasHobbies && hasGoals;
  return this.profile.isProfileComplete;
};

// Add notification method
studentSchema.methods.addNotification = function(type, message, relatedData = {}) {
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

module.exports = mongoose.model('Student', studentSchema); 