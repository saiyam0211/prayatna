const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schoolSchema = new mongoose.Schema({
  schoolId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    website: String,
    logo: String,
    establishedYear: Number,
    principalName: String,
    totalStudents: {
      type: Number,
      default: 0
    },
    totalTeachers: {
      type: Number,
      default: 0
    }
  },
  students: [{
    enrollmentId: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    isRegistered: {
      type: Boolean,
      default: false
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  teachers: [{
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    experience: {
      type: Number,
      required: true
    },
    isRegistered: {
      type: Boolean,
      default: false
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  flaggedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  schoolPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  settings: {
    allowStudentPosts: {
      type: Boolean,
      default: true
    },
    requirePostApproval: {
      type: Boolean,
      default: false
    },
    allowAnonymousPosts: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
schoolSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Hash teacher passwords before saving
schoolSchema.pre('save', async function(next) {
  if (this.teachers && this.teachers.length > 0) {
    for (let teacher of this.teachers) {
      if (teacher.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        teacher.password = await bcrypt.hash(teacher.password, salt);
      }
    }
  }
  next();
});

// Compare password method
schoolSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Compare teacher password method
schoolSchema.methods.compareTeacherPassword = async function(email, candidatePassword) {
  const teacher = this.teachers.find(t => t.email === email);
  if (!teacher) return false;
  return await bcrypt.compare(candidatePassword, teacher.password);
};

// Get school statistics
schoolSchema.methods.getStats = function() {
  const registeredStudents = this.students.filter(s => s.isRegistered).length;
  const registeredTeachers = this.teachers.filter(t => t.isRegistered).length;
  
  return {
    totalUsers: registeredStudents + registeredTeachers,
    totalStudents: registeredStudents,
    totalTeachers: registeredTeachers,
    pendingStudents: this.students.length - registeredStudents,
    pendingTeachers: this.teachers.length - registeredTeachers,
    flaggedPostsCount: this.flaggedPosts.length
  };
};

module.exports = mongoose.model('School', schoolSchema); 