const geminiService = require('./geminiService');

class AIModerationService {
  constructor() {
    this.moderationPrompt = `You are a content safety reviewer for school student posts. 
The audience is middle schoolers (Class 7 and 8, ages 12–14). 
Flag any content that is inappropriate, flirty, negative, harmful, bullying, violent, or controversial. 
Only allow posts that are safe, kind, respectful, and age-appropriate. 
Respond with only one of these: 'Red Flag' or 'Green Flag'.`;
  }

  // Simple keyword-based moderation (fallback when AI is not available)
  simpleModeration(content) {
    const redFlagKeywords = [
      'hate', 'stupid', 'idiot', 'kill', 'die', 'death', 'violence', 'fight',
      'bully', 'ugly', 'fat', 'loser', 'dumb', 'shut up', 'go away',
      'inappropriate', 'sexy', 'hot', 'dating', 'boyfriend', 'girlfriend',
      'drugs', 'alcohol', 'smoke', 'cigarette', 'beer', 'wine',
      'cheat', 'copy', 'steal', 'lie', 'fake'
    ];

    const contentLower = content.toLowerCase();
    
    for (const keyword of redFlagKeywords) {
      if (contentLower.includes(keyword)) {
        return {
          flag: 'Red Flag',
          reason: `Contains potentially inappropriate keyword: ${keyword}`,
          confidence: 0.8
        };
      }
    }

    return {
      flag: 'Green Flag',
      reason: 'Content appears safe for school environment',
      confidence: 0.7
    };
  }

  // AI-based moderation using Gemini
  async aiModeration(content) {
    try {
      console.log('Using Gemini AI for content moderation...');
      const result = await geminiService.moderatePost(content);
      return result;
    } catch (error) {
      console.error('Gemini AI moderation error:', error);
      console.log('Falling back to simple moderation');
      return this.simpleModeration(content);
    }
  }

  // Main moderation function
  async moderateContent(content, authorRole = 'student') {
    try {
      // Teachers' posts are auto-approved if configured
      if (authorRole === 'teacher' && process.env.AUTO_APPROVE_TEACHER_POSTS === 'true') {
        return {
          flag: 'Green Flag',
          reason: 'Teacher post auto-approved',
          confidence: 1.0,
          autoApproved: true
        };
      }

      // School posts are always auto-approved
      if (authorRole === 'school') {
        return {
          flag: 'Green Flag',
          reason: 'School post auto-approved',
          confidence: 1.0,
          autoApproved: true
        };
      }

      // For student posts, use AI moderation with Gemini
      const result = await this.aiModeration(content);
      
      return {
        ...result,
        autoApproved: false
      };
      
    } catch (error) {
      console.error('Content moderation error:', error);
      // In case of error, flag for manual review
      return {
        flag: 'Red Flag',
        reason: 'Error in moderation - requires manual review',
        confidence: 0.0,
        autoApproved: false,
        error: error.message
      };
    }
  }

  // Batch moderation for multiple posts
  async moderateMultiple(posts) {
    const results = [];
    
    for (const post of posts) {
      const result = await this.moderateContent(post.content, post.authorRole);
      results.push({
        postId: post.id,
        ...result
      });
    }
    
    return results;
  }

  // Health check for AI services
  async healthCheck() {
    try {
      const geminiHealth = await geminiService.healthCheck();
      return {
        gemini: geminiHealth,
        fallbackAvailable: true
      };
    } catch (error) {
      return {
        gemini: { status: 'error', error: error.message },
        fallbackAvailable: true
      };
    }
  }
}

module.exports = new AIModerationService(); 