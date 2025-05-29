const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const School = require('../models/School');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const twilioService = require('../services/twilioService');
const bcrypt = require('bcrypt');

const router = express.Router();

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// School Login
router.post('/school/login', [
  body('schoolId').notEmpty().withMessage('School ID is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

    const { schoolId, password } = req.body;

    // Check if school exists
    let school = await School.findOne({ schoolId: schoolId.toUpperCase() });
    
    if (school) {
      // Verify password for existing school
      const isPasswordValid = await school.comparePassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    } else {
      // If school doesn't exist and matches default credentials, create it
      if (schoolId.toUpperCase() === process.env.DEFAULT_SCHOOL_ID) {
        if (password === process.env.DEFAULT_SCHOOL_PASSWORD) {
          school = new School({
            schoolId: process.env.DEFAULT_SCHOOL_ID,
            password: process.env.DEFAULT_SCHOOL_PASSWORD,
            profile: {
              name: 'Prayatna Community School',
              address: '123 Education Street',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001',
              phone: '+91-9876543210',
              email: 'admin@prayatna.edu.in',
              website: 'www.prayatna.edu.in',
              establishedYear: 2010,
              principalName: 'Dr. Rajesh Sharma'
            }
          });
          await school.save();
        } else {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: 'School not found'
        });
      }
    }

    // Generate token
    const token = generateToken({
      id: school._id,
      role: 'school',
      schoolId: school.schoolId
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: school._id,
        role: 'school',
        schoolId: school.schoolId,
        profile: school.profile
      }
    });

  } catch (error) {
    console.error('School login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// School Signup
router.post('/school/signup', [
  body('schoolId').notEmpty().withMessage('School ID is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('schoolName').notEmpty().withMessage('School name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('pincode').notEmpty().withMessage('Pincode is required'),
  body('contactPhone').notEmpty().withMessage('Contact phone is required'),
  body('contactEmail').isEmail().withMessage('Valid email is required'),
  body('principalName').notEmpty().withMessage('Principal name is required'),
  body('educationBoard').notEmpty().withMessage('Education board is required'),
  body('highestClassOffered').notEmpty().withMessage('Highest class offered is required')
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

    const {
      schoolId,
      password,
      schoolName,
      address,
      city,
      state,
      pincode,
      contactPhone,
      contactEmail,
      principalName,
      educationBoard,
      highestClassOffered,
      establishmentDate
    } = req.body;

    // Check if school ID already exists
    const existingSchool = await School.findOne({ schoolId: schoolId.toUpperCase() });
    if (existingSchool) {
      return res.status(400).json({
        success: false,
        message: 'School ID already exists'
      });
    }

    // Check if email already exists
    const existingEmail = await School.findOne({ 'profile.email': contactEmail.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new school
    const school = new School({
      schoolId: schoolId.toUpperCase(),
      password,
      profile: {
        name: schoolName,
        address,
        city,
        state,
        pincode,
        phone: contactPhone,
        email: contactEmail.toLowerCase(),
        principalName,
        establishedYear: establishmentDate ? new Date(establishmentDate).getFullYear() : new Date().getFullYear(),
        totalStudents: 0,
        totalTeachers: 0
      },
      settings: {
        allowStudentPosts: true,
        requirePostApproval: false,
        allowAnonymousPosts: false
      }
    });

    await school.save();

    // Generate token
    const token = generateToken({
      id: school._id,
      role: 'school',
      schoolId: school.schoolId
    });

    res.status(201).json({
      success: true,
      message: 'School registered successfully',
      token,
      user: {
        id: school._id,
        role: 'school',
        schoolId: school.schoolId,
        profile: school.profile
      },
      additionalInfo: {
        educationBoard,
        highestClassOffered
      }
    });

  } catch (error) {
    console.error('School signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Send OTP for Student Signup
router.post('/student/send-otp', [
  body('enrollmentId').notEmpty().withMessage('Enrollment ID is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required')
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

    const { enrollmentId, phoneNumber } = req.body;

    // Find school that has this enrollment ID and phone number combination
    const school = await School.findOne({
      'students.enrollmentId': enrollmentId.toUpperCase(),
      'students.phoneNumber': phoneNumber
    });

    if (!school) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enrollment ID or phone number. Please contact your school.'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ enrollmentId: enrollmentId.toUpperCase() });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student account already exists'
      });
    }

    // Send OTP
    const otpResult = await twilioService.sendOTP(phoneNumber);
    
    if (!otpResult.success) {
      return res.status(500).json({
        success: false,
        message: otpResult.message
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully to your phone number',
      data: {
        enrollmentId: enrollmentId.toUpperCase(),
        phoneNumber,
        otpSent: true
      }
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending OTP'
    });
  }
});

// Student Signup with OTP Verification
router.post('/student/signup', [
  body('enrollmentId').notEmpty().withMessage('Enrollment ID is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('otp').isLength({ min: 4, max: 6 }).withMessage('Valid OTP is required')
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

    const { enrollmentId, phoneNumber, password, otp } = req.body;

    // Verify OTP first
    const otpVerification = await twilioService.verifyOTP(phoneNumber, otp);
    
    if (!otpVerification.success) {
      return res.status(400).json({
        success: false,
        message: otpVerification.message
      });
    }

    // Find school that has this enrollment ID and phone number combination
    const school = await School.findOne({
      'students.enrollmentId': enrollmentId.toUpperCase(),
      'students.phoneNumber': phoneNumber
    });

    if (!school) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enrollment ID or phone number. Please contact your school.'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ enrollmentId: enrollmentId.toUpperCase() });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student account already exists'
      });
    }

    // Create student account
    const student = new Student({
      enrollmentId: enrollmentId.toUpperCase(),
      phoneNumber,
      password,
      school: school._id,
      profile: {
        isProfileComplete: false
      },
      skillMarks: {
        mathematics: 0,
        english: 0,
        science: 0
      }
    });

    await student.save();

    // Update school's student record
    const studentRecord = school.students.find(s => 
      s.enrollmentId === enrollmentId.toUpperCase() && s.phoneNumber === phoneNumber
    );
    if (studentRecord) {
      studentRecord.isRegistered = true;
      studentRecord.studentId = student._id;
      await school.save();
    }

    // Send welcome SMS
    await twilioService.sendSMS(
      phoneNumber, 
      `Welcome to Prayatna! Your account has been created successfully. Start exploring and connecting with your school community!`
    );

    // Generate token
    const token = generateToken({
      id: student._id,
      role: 'student',
      schoolId: school.schoolId
    });

    res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      token,
      user: {
        id: student._id,
        role: 'student',
        enrollmentId: student.enrollmentId,
        phoneNumber: student.phoneNumber,
        profile: student.profile,
        isProfileComplete: student.profile.isProfileComplete
      }
    });

  } catch (error) {
    console.error('Student signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
});

// Student Login
router.post('/student/login', [
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { phoneNumber, password } = req.body;

    // Find student by phone number
    const student = await Student.findOne({ 
      phoneNumber: phoneNumber 
    }).populate('school', 'profile.name schoolId');

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Verify password
    const isPasswordValid = await student.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Fix education field structure if needed (migration)
    if (Array.isArray(student.education)) {
      student.education = {
        marksheets: [],
        lastProcessed: null
      };
    }

    // Initialize nested objects if they don't exist
    if (!student.skillMarks) {
      student.skillMarks = {
        mathematics: 0,
        english: 0,
        science: 0,
        lastUpdated: new Date()
      };
    }

    if (!student.streak) {
      student.streak = {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null
      };
    }

    // Update last login and streak
    student.lastLogin = new Date();
    student.updateStreak();
    await student.save();

    // Generate token
    const token = generateToken({
      id: student._id,
      role: 'student',
      schoolId: student.school.schoolId
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: student._id,
        role: 'student',
        enrollmentId: student.enrollmentId,
        phoneNumber: student.phoneNumber,
        profile: student.profile,
        school: student.school,
        isProfileComplete: student.profile.isProfileComplete,
        streak: student.streak
      }
    });

  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Teacher Login
router.post('/teacher/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { email, password } = req.body;

    // Find teacher
    const teacher = await Teacher.findOne({ 
      email: email.toLowerCase() 
    }).populate('school', 'profile.name schoolId');

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await teacher.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    teacher.lastLogin = new Date();
    await teacher.save();

    // Generate token
    const token = generateToken({
      id: teacher._id,
      role: 'teacher',
      schoolId: teacher.school.schoolId
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: teacher._id,
        role: 'teacher',
        email: teacher.email,
        profile: teacher.profile,
        school: teacher.school
      }
    });

  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Verify Token
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
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
        message: 'Invalid token'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        role: decoded.role,
        ...user.toObject()
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Logout (client-side token removal, but we can track it)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Temporary test route to create student for testing
router.post('/test/create-student', async (req, res) => {
  try {
    // Find the school using the default school ID
    const school = await School.findOne({ schoolId: process.env.DEFAULT_SCHOOL_ID || 'PRAYATNA2024' });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    // Check if student already exists
    let student = await Student.findOne({ enrollmentId: 'STU2024TEST' });
    if (student) {
      // Delete the existing student and recreate with correct password
      await Student.deleteOne({ enrollmentId: 'STU2024TEST' });
    }

    // Create student
    student = new Student({
      enrollmentId: 'STU2024TEST',
      phoneNumber: '9999999999',
      password: 'test123', // Let the pre-save hook handle hashing
      school: school._id,
      profile: {
        name: 'Test Student',
        isProfileComplete: false
      },
      skillMarks: {
        mathematics: 0,
        english: 0,
        science: 0
      }
    });

    await student.save();

    res.json({
      success: true,
      message: 'Test student created successfully',
      credentials: {
        phoneNumber: '9999999999',
        password: 'test123'
      }
    });

  } catch (error) {
    console.error('Test student creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test student'
    });
  }
});

module.exports = router; 