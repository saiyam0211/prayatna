const express = require('express');
const { body, validationResult } = require('express-validator');
const ContentModerationService = require('../services/contentModeration');
const geminiService = require('../services/geminiService');
const vertexAIService = require('../services/vertexAIService');
const aiModerationService = require('../services/aiModerationService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { anyAuth, studentOnly } = require('../middleware/auth');
const Student = require('../models/Student');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/marksheets');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG) and PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Enhanced content moderation using Gemini AI
router.post('/moderate-content', anyAuth, [
  body('text').notEmpty().withMessage('Content text is required'),
  body('authorRole').optional().isIn(['student', 'teacher', 'school']).withMessage('Invalid author role')
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

    const { text, authorRole = 'student' } = req.body;

    // Use enhanced AI moderation with Gemini
    const moderationResult = await aiModerationService.moderateContent(text, authorRole);

    res.json({
      success: true,
      data: {
        moderation: moderationResult,
        recommendations: generateContentRecommendations(moderationResult)
      }
    });

  } catch (error) {
    console.error('Content moderation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error moderating content',
      error: error.message
    });
  }
});

// Upload and analyze marksheets using Vertex AI
router.post('/analyze-marksheets', studentOnly, upload.array('marksheets', 3), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No marksheet files uploaded'
      });
    }

    const student = req.user;
    const imagePaths = req.files.map(file => file.path);

    console.log(`Processing ${imagePaths.length} marksheet images for student ${student._id}`);

    // Process marksheets using Vertex AI
    const analysisResult = await vertexAIService.processMultipleImages(imagePaths);

    if (analysisResult.success) {
      // Update student's skill marks
      student.skillMarks = {
        mathematics: analysisResult.averageScores.mathematics || 0,
        english: analysisResult.averageScores.english || 0,
        science: analysisResult.averageScores.science || 0,
        lastUpdated: new Date(),
        analysisMethod: 'vertex_ai_image_analysis'
      };

      await student.save();

      // Clean up uploaded files
      imagePaths.forEach(imagePath => {
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      });

      res.json({
        success: true,
        message: 'Marksheets analyzed successfully',
        data: {
          skillMarks: student.skillMarks,
          analysis: analysisResult,
          recommendations: generateSkillRecommendations(analysisResult.averageScores)
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to analyze marksheets',
        error: analysisResult.error
      });
    }

  } catch (error) {
    console.error('Marksheet analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing marksheets',
      error: error.message
    });
  }
});

// Test Gemini AI post moderation
router.post('/test-gemini-moderation', anyAuth, [
  body('text').notEmpty().withMessage('Text is required')
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

    const { text } = req.body;

    const result = await geminiService.moderatePost(text);

    res.json({
      success: true,
      data: {
        input: text,
        result
      }
    });

  } catch (error) {
    console.error('Gemini moderation test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing Gemini moderation',
      error: error.message
    });
  }
});

// Health check for AI services
router.get('/health', async (req, res) => {
  try {
    const healthChecks = await Promise.allSettled([
      geminiService.healthCheck(),
      vertexAIService.healthCheck(),
      aiModerationService.healthCheck()
    ]);

    const results = {
      gemini: healthChecks[0].status === 'fulfilled' ? healthChecks[0].value : { status: 'error', error: healthChecks[0].reason },
      vertexAI: healthChecks[1].status === 'fulfilled' ? healthChecks[1].value : { status: 'error', error: healthChecks[1].reason },
      moderation: healthChecks[2].status === 'fulfilled' ? healthChecks[2].value : { status: 'error', error: healthChecks[2].reason }
    };

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking AI services health',
      error: error.message
    });
  }
});

// Analyze content for moderation (legacy endpoint, updated to use Gemini)
router.post('/analyze-content', anyAuth, [
  body('text').notEmpty().withMessage('Content text is required')
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

    const { text, context } = req.body;

    // Use Gemini for content analysis
    const analysis = await geminiService.moderatePost(text);

    res.json({
      success: true,
      data: {
        analysis,
        recommendations: generateContentRecommendations(analysis)
      }
    });

  } catch (error) {
    console.error('Content analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing content'
    });
  }
});

// Calculate student skill marks from marksheets
router.post('/calculate-skills', studentOnly, async (req, res) => {
  try {
    const student = req.user;
    const { marksheetData } = req.body; // Array of marksheet analysis results

    if (!marksheetData || marksheetData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No marksheet data provided'
      });
    }

    // Calculate skill marks using AI analysis
    const skillMarks = await calculateSkillMarks(marksheetData);

    // Update student's skill marks
    student.skillMarks = {
      mathematics: skillMarks.mathematics,
      english: skillMarks.english,
      science: skillMarks.science,
      lastUpdated: new Date(),
      analysisMethod: 'ai_marksheet_analysis'
    };

    await student.save();

    res.json({
      success: true,
      message: 'Skill marks calculated successfully',
      data: {
        skillMarks: student.skillMarks,
        analysis: skillMarks.analysis,
        recommendations: generateSkillRecommendations(skillMarks)
      }
    });

  } catch (error) {
    console.error('Skill calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating skill marks'
    });
  }
});

// Get AI-powered motivational quote based on student status
router.get('/motivational-quote', studentOnly, async (req, res) => {
  try {
    const student = req.user;
    
    // Generate contextual motivational quote
    const quote = generateMotivationalQuote(student);

    res.json({
      success: true,
      data: {
        quote,
        context: determineStudentContext(student)
      }
    });

  } catch (error) {
    console.error('Motivational quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating motivational quote'
    });
  }
});

// AI-powered content suggestions for posts
router.post('/content-suggestions', anyAuth, [
  body('category').notEmpty().withMessage('Content category is required'),
  body('context').optional().isString()
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

    const { category, context, currentText } = req.body;
    const user = req.user;
    const userRole = req.userRole;

    // Generate content suggestions based on category and user role
    const suggestions = await generateContentSuggestions(category, context, userRole, currentText);

    res.json({
      success: true,
      data: {
        suggestions,
        category,
        userRole
      }
    });

  } catch (error) {
    console.error('Content suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating content suggestions'
    });
  }
});

// AI-powered study recommendations for students
router.get('/study-recommendations', studentOnly, async (req, res) => {
  try {
    const student = req.user;

    // Generate personalized study recommendations
    const recommendations = await generateStudyRecommendations(student);

    res.json({
      success: true,
      data: {
        recommendations,
        basedOn: {
          skillMarks: student.skillMarks,
          class: student.profile.class,
          interests: student.profile.interests,
          currentGoals: student.profile.currentGoals
        }
      }
    });

  } catch (error) {
    console.error('Study recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating study recommendations'
    });
  }
});

// Analyze image content (for posts and achievements)
router.post('/analyze-image', anyAuth, [
  body('imageUrl').notEmpty().withMessage('Image URL is required')
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

    const { imageUrl, context } = req.body;

    // Analyze image content for safety and appropriateness
    const analysis = await analyzeImageContent(imageUrl, context);

    res.json({
      success: true,
      data: {
        analysis,
        approved: analysis.safety.isAppropriate,
        tags: analysis.content.tags,
        description: analysis.content.description
      }
    });

  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing image'
    });
  }
});

// Generate hashtags for posts
router.post('/generate-hashtags', anyAuth, [
  body('content').notEmpty().withMessage('Post content is required')
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

    const { content, category } = req.body;

    // Generate relevant hashtags
    const hashtags = generateHashtags(content, category);

    res.json({
      success: true,
      data: {
        hashtags,
        suggested: hashtags.slice(0, 5), // Top 5 suggestions
        all: hashtags
      }
    });

  } catch (error) {
    console.error('Hashtag generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating hashtags'
    });
  }
});

// AI helper functions

function generateContentRecommendations(analysis) {
  const recommendations = [];
  
  if (analysis.safety.score < 0.7) {
    recommendations.push({
      type: 'safety',
      message: 'Consider revising your content to be more appropriate for a school environment',
      priority: 'high'
    });
  }

  if (analysis.sentiment.score < 0.3) {
    recommendations.push({
      type: 'tone',
      message: 'Try to add a more positive tone to engage your audience better',
      priority: 'medium'
    });
  }

  if (analysis.profanity.hasProfanity) {
    recommendations.push({
      type: 'language',
      message: 'Please remove inappropriate language to maintain a respectful environment',
      priority: 'high'
    });
  }

  return recommendations;
}

async function calculateSkillMarks(marksheetData) {
  // Simulate AI analysis of marksheet data
  // In a real implementation, this would use OCR and AI to extract and analyze marks
  
  const totalMarks = marksheetData.reduce((sum, sheet) => {
    return {
      math: sum.math + (sheet.subjects.mathematics || 0),
      english: sum.english + (sheet.subjects.english || 0),
      science: sum.science + (sheet.subjects.science || 0)
    };
  }, { math: 0, english: 0, science: 0 });

  const count = marksheetData.length;

  return {
    mathematics: Math.min(100, Math.round((totalMarks.math / count) * 1.1)), // Slight boost for AI analysis
    english: Math.min(100, Math.round((totalMarks.english / count) * 1.1)),
    science: Math.min(100, Math.round((totalMarks.science / count) * 1.1)),
    analysis: {
      trend: 'improving', // Could be 'improving', 'stable', 'declining'
      strongestSubject: Object.entries(totalMarks).sort((a, b) => b[1] - a[1])[0][0],
      improvementArea: Object.entries(totalMarks).sort((a, b) => a[1] - b[1])[0][0]
    }
  };
}

function generateMotivationalQuote(student) {
  const quotes = {
    zeroStreak: [
      "Every expert was once a beginner. Your journey starts today! 🌟",
      "The best time to plant a tree was 20 years ago. The second best time is now! 🌱",
      "A thousand-mile journey begins with a single step. Take yours today! 👣",
      "Don't watch the clock; do what it does. Keep going! ⏰",
      "Success is not final, failure is not fatal: it is the courage to continue that counts! 💪"
    ],
    lowStreak: [
      "Great job getting started! Keep building your streak! 🔥",
      "You're on the right track. Consistency is key! 📈",
      "Small steps daily lead to big changes yearly! 🎯",
      "Every day you don't give up is a win! 🏆"
    ],
    highStreak: [
      "Incredible consistency! You're building something amazing! 🚀",
      "Your dedication is inspiring! Keep this momentum going! ⚡",
      "You're proving that persistence pays off! 🌟",
      "Amazing streak! You're setting a great example! 👑"
    ]
  };

  let category;
  if (student.streak.currentStreak === 0) {
    category = 'zeroStreak';
  } else if (student.streak.currentStreak < 7) {
    category = 'lowStreak';
  } else {
    category = 'highStreak';
  }

  const categoryQuotes = quotes[category];
  return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
}

function determineStudentContext(student) {
  return {
    streakStatus: student.streak.currentStreak === 0 ? 'starting' : 
                  student.streak.currentStreak < 7 ? 'building' : 'strong',
    profileCompletion: student.profile.isProfileComplete ? 'complete' : 'incomplete',
    skillLevel: getAverageSkillLevel(student.skillMarks),
    activityLevel: student.posts.length > 10 ? 'active' : 'moderate'
  };
}

function getAverageSkillLevel(skillMarks) {
  if (!skillMarks.mathematics) return 'unknown';
  
  const avg = (skillMarks.mathematics + skillMarks.english + skillMarks.science) / 3;
  if (avg >= 90) return 'excellent';
  if (avg >= 75) return 'good';
  if (avg >= 60) return 'average';
  return 'needsImprovement';
}

async function generateContentSuggestions(category, context, userRole, currentText) {
  const suggestions = {
    achievement: [
      "Share what you learned from this experience",
      "Mention who supported you in achieving this",
      "Describe the challenges you overcame",
      "Add tips for others who want similar achievements"
    ],
    study: [
      "Include study tips that worked for you",
      "Share resources that helped you understand the topic",
      "Mention any collaborative study methods",
      "Add visual aids or diagrams if helpful"
    ],
    general: [
      "Make it relatable to your classmates",
      "Add a question to encourage discussion",
      "Share your personal perspective",
      "Include encouraging words for others"
    ],
    announcement: [
      "Clearly state the key information",
      "Include relevant dates and deadlines",
      "Add contact information for questions",
      "Use bullet points for better readability"
    ]
  };

  return suggestions[category] || suggestions.general;
}

async function generateStudyRecommendations(student) {
  const recommendations = [];

  // Based on skill marks
  if (student.skillMarks.mathematics < 70) {
    recommendations.push({
      subject: 'Mathematics',
      type: 'improvement',
      suggestions: [
        'Practice daily math problems for 30 minutes',
        'Join study groups for collaborative learning',
        'Use visual aids and online math tools',
        'Ask teachers for extra help during office hours'
      ],
      priority: 'high'
    });
  }

  if (student.skillMarks.english < 70) {
    recommendations.push({
      subject: 'English',
      type: 'improvement',
      suggestions: [
        'Read for 20 minutes daily',
        'Practice writing essays and get feedback',
        'Expand vocabulary using flashcards',
        'Join debate or drama clubs to improve speaking'
      ],
      priority: 'high'
    });
  }

  if (student.skillMarks.science < 70) {
    recommendations.push({
      subject: 'Science',
      type: 'improvement',
      suggestions: [
        'Do hands-on experiments when possible',
        'Watch educational science videos',
        'Create concept maps for complex topics',
        'Form study groups to discuss difficult concepts'
      ],
      priority: 'high'
    });
  }

  // Based on interests
  if (student.profile.interests && student.profile.interests.length > 0) {
    recommendations.push({
      type: 'interest-based',
      suggestions: student.profile.interests.map(interest => 
        `Explore advanced topics in ${interest} to deepen your knowledge`
      ),
      priority: 'medium'
    });
  }

  return recommendations;
}

async function analyzeImageContent(imageUrl, context) {
  // Simulate image analysis - in real implementation, this would use computer vision APIs
  return {
    safety: {
      isAppropriate: true,
      score: 0.95,
      concerns: []
    },
    content: {
      description: 'Educational content suitable for school environment',
      tags: ['education', 'learning', 'school'],
      category: context || 'general'
    },
    technical: {
      quality: 'good',
      resolution: 'adequate',
      format: 'supported'
    }
  };
}

function generateHashtags(content, category) {
  const commonHashtags = {
    achievement: ['#achievement', '#success', '#milestone', '#proud', '#learning', '#growth'],
    study: ['#study', '#education', '#learning', '#knowledge', '#students', '#school'],
    general: ['#school', '#students', '#community', '#sharing', '#learning'],
    announcement: ['#announcement', '#important', '#school', '#students', '#notice']
  };

  const baseHashtags = commonHashtags[category] || commonHashtags.general;
  
  // Extract keywords from content
  const words = content.toLowerCase().split(/\s+/);
  const keywords = words.filter(word => 
    word.length > 4 && 
    !['this', 'that', 'with', 'have', 'been', 'from', 'they', 'were', 'said'].includes(word)
  );

  const contentHashtags = keywords.slice(0, 3).map(word => `#${word}`);
  
  return [...baseHashtags, ...contentHashtags].slice(0, 10);
}

// Helper function to generate content recommendations
function generateContentRecommendations(moderationResult) {
  const recommendations = [];
  
  if (moderationResult.flag === 'Red Flag') {
    recommendations.push('Consider revising your content to be more positive and appropriate');
    recommendations.push('Focus on constructive and encouraging messages');
    recommendations.push('Avoid controversial or sensitive topics');
  } else if (moderationResult.flag === 'Green Flag') {
    recommendations.push('Great content! Your post follows community guidelines');
    recommendations.push('Consider adding relevant tags to increase visibility');
  }
  
  // Add role-specific recommendations
  if (moderationResult.authorRole === 'student') {
    recommendations.push('Share your learning journey and achievements');
    recommendations.push('Ask questions and seek help from peers and teachers');
  } else if (moderationResult.authorRole === 'teacher') {
    recommendations.push('Share educational resources and insights');
    recommendations.push('Encourage student participation and discussion');
  } else if (moderationResult.authorRole === 'school') {
    recommendations.push('Keep announcements clear and informative');
    recommendations.push('Use appropriate formatting for official communications');
  }
  
  return recommendations;
}

// Helper function to generate skill recommendations
function generateSkillRecommendations(skillScores) {
  const recommendations = [];
  
  if (skillScores.mathematics < 60) {
    recommendations.push('Consider additional practice in mathematics fundamentals');
    recommendations.push('Try online math resources or tutoring');
  } else if (skillScores.mathematics >= 80) {
    recommendations.push('Excellent math skills! Consider advanced problem-solving');
  }
  
  if (skillScores.science < 60) {
    recommendations.push('Focus on science concepts through hands-on experiments');
    recommendations.push('Use visual aids and interactive science resources');
  } else if (skillScores.science >= 80) {
    recommendations.push('Strong science foundation! Explore STEM competitions');
  }
  
  if (skillScores.english < 60) {
    recommendations.push('Practice reading comprehension and vocabulary building');
    recommendations.push('Consider joining reading clubs or language exchange');
  } else if (skillScores.english >= 80) {
    recommendations.push('Great language skills! Try creative writing or debate');
  }
  
  return recommendations;
}

module.exports = router; 