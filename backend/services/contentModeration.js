const axios = require('axios');

// Simple profanity word list (in production, use a more comprehensive service)
const PROFANITY_WORDS = [
  'damn', 'hell', 'stupid', 'idiot', 'hate', 'kill', 'die', 'ugly', 'fat', 'loser'
  // Add more words as needed
];

// Content moderation using basic AI analysis
class ContentModerationService {
  constructor() {
    this.moderationPrompt = `You are a content safety reviewer for school student posts. 
The audience is middle schoolers (Class 7 and 8, ages 12–14). 
Flag any content that is inappropriate, flirty, negative, harmful, bullying, violent, or controversial. 
Only allow posts that are safe, kind, respectful, and age-appropriate. 
Respond with only one of these: 'Red Flag' or 'Green Flag'.`;
  }

  async moderateContent(content) {
    try {
      // Simulate AI moderation - Replace with actual AI service later
      const result = await this.simulateAIModeration(content);
      
      return {
        flag: result,
        timestamp: new Date(),
        confidence: 0.85
      };
    } catch (error) {
      console.error('Content moderation error:', error);
      // In case of error, flag for manual review
      return {
        flag: 'Red Flag',
        timestamp: new Date(),
        confidence: 0.0,
        error: true
      };
    }
  }

  async simulateAIModeration(content) {
    // Simple keyword-based moderation for now
    const redFlagKeywords = [
      'hate', 'stupid', 'dumb', 'kill', 'die', 'hurt', 'fight', 'bad', 'ugly',
      'dating', 'boyfriend', 'girlfriend', 'love', 'kiss', 'flirt',
      'drugs', 'alcohol', 'smoke', 'vape', 'party', 'skip class'
    ];

    const contentLower = content.toLowerCase();
    
    // Check for red flag keywords
    for (const keyword of redFlagKeywords) {
      if (contentLower.includes(keyword)) {
        return 'Red Flag';
      }
    }

    // Check for excessive caps (shouting)
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsRatio > 0.3 && content.length > 20) {
      return 'Red Flag';
    }

    // Check for spam patterns
    const repeatedChars = /(.)\1{4,}/;
    if (repeatedChars.test(content)) {
      return 'Red Flag';
    }

    return 'Green Flag';
  }

  async batchModerate(posts) {
    const results = [];
    
    for (const post of posts) {
      const result = await this.moderateContent(post.content);
      results.push({
        postId: post._id,
        ...result
      });
    }
    
    return results;
  }

  static async analyzeContent(text) {
    try {
      // Basic analysis without external API for now
      const analysis = {
        profanityScore: this.detectProfanity(text),
        sentimentScore: this.analyzeSentiment(text),
        ageAppropriate: this.checkAgeAppropriateness(text),
        socialContext: this.checkSocialContext(text)
      };

      const safetyScore = this.calculateSafetyScore(analysis);
      const flag = safetyScore > 0.7 ? 'Green Flag' : 'Red Flag';
      
      return {
        flag,
        safetyScore,
        reason: this.generateReason(analysis, flag),
        details: analysis
      };

    } catch (error) {
      console.error('Content moderation error:', error);
      // Default to manual review on error
      return {
        flag: 'Red Flag',
        safetyScore: 0.5,
        reason: 'Content requires manual review due to analysis error',
        details: null
      };
    }
  }

  static detectProfanity(text) {
    const words = text.toLowerCase().split(/\s+/);
    const profanityCount = words.filter(word => 
      PROFANITY_WORDS.some(profanity => word.includes(profanity))
    ).length;
    
    // Return 0 if no profanity, 1 if profanity found
    return profanityCount > 0 ? 1 : 0;
  }

  static analyzeSentiment(text) {
    // Simple sentiment analysis based on keywords
    const positiveWords = ['good', 'great', 'awesome', 'amazing', 'excellent', 'wonderful', 'happy', 'love', 'best', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'sad', 'angry', 'disgusting', 'pathetic'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });
    
    const totalEmotionalWords = positiveCount + negativeCount;
    if (totalEmotionalWords === 0) return 0; // Neutral
    
    return (positiveCount - negativeCount) / totalEmotionalWords;
  }

  static checkAgeAppropriateness(text) {
    // Check for age-inappropriate content
    const inappropriateTopics = ['dating', 'relationship', 'boyfriend', 'girlfriend', 'romance', 'sexy', 'drugs', 'alcohol', 'smoking'];
    const words = text.toLowerCase();
    
    return !inappropriateTopics.some(topic => words.includes(topic));
  }

  static checkSocialContext(text) {
    // Check if content is appropriate for school environment
    const schoolAppropriate = ['study', 'homework', 'project', 'exam', 'teacher', 'class', 'learning', 'achievement', 'goal', 'friend'];
    const words = text.toLowerCase();
    
    // Check for educational context
    const hasEducationalContext = schoolAppropriate.some(word => words.includes(word));
    
    // Check for harmful social content
    const bullyingIndicators = ['stupid', 'ugly', 'fat', 'loser', 'weirdo', 'freak'];
    const hasBullying = bullyingIndicators.some(word => words.includes(word));
    
    return hasEducationalContext || !hasBullying;
  }

  static calculateSafetyScore(analysis) {
    const { profanityScore, sentimentScore, ageAppropriate, socialContext } = analysis;
    
    // Safety score formula from algo.md
    const score = 
      0.4 * (1 - profanityScore) +
      0.3 * ((sentimentScore + 1) / 2) +
      0.2 * (ageAppropriate ? 1 : 0) +
      0.1 * (socialContext ? 1 : 0);
    
    return Math.round(score * 100) / 100; // Round to 2 decimal places
  }

  static generateReason(analysis, flag) {
    if (flag === 'Green Flag') {
      return 'Content appears safe and appropriate for school environment';
    }
    
    const reasons = [];
    
    if (analysis.profanityScore > 0) {
      reasons.push('inappropriate language detected');
    }
    
    if (analysis.sentimentScore < -0.5) {
      reasons.push('negative sentiment');
    }
    
    if (!analysis.ageAppropriate) {
      reasons.push('age-inappropriate content');
    }
    
    if (!analysis.socialContext) {
      reasons.push('inappropriate for school environment');
    }
    
    return reasons.length > 0 
      ? `Content flagged due to: ${reasons.join(', ')}`
      : 'Content requires manual review';
  }

  // Enhanced AI analysis using OpenAI (when API key is available)
  static async analyzeWithAI(text) {
    if (!process.env.OPENAI_API_KEY) {
      return this.analyzeContent(text);
    }

    try {
      const prompt = `You are a content safety reviewer for school student posts. 
The audience is middle schoolers (Class 7 and 8, ages 12–14). 
Flag any content that is inappropriate, flirty, negative, harmful, bullying, violent, or controversial. 
Only allow posts that are safe, kind, respectful, and age-appropriate. 
Respond with only one of these: 'Red Flag' or 'Green Flag'.

Content to review: "${text}"`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a content moderation AI for a school platform.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 10,
        temperature: 0
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const aiFlag = response.data.choices[0].message.content.trim();
      
      // Validate AI response
      if (!['Red Flag', 'Green Flag'].includes(aiFlag)) {
        console.warn('Invalid AI response, falling back to basic analysis');
        return this.analyzeContent(text);
      }

      return {
        flag: aiFlag,
        safetyScore: aiFlag === 'Green Flag' ? 0.8 : 0.3,
        reason: aiFlag === 'Green Flag' 
          ? 'AI approved content as safe and appropriate'
          : 'AI flagged content as potentially inappropriate',
        details: { aiAnalysis: true, model: 'gpt-3.5-turbo' }
      };

    } catch (error) {
      console.error('OpenAI API error:', error.message);
      // Fallback to basic analysis
      return this.analyzeContent(text);
    }
  }

  // Batch analysis for multiple posts
  static async analyzeBatch(posts) {
    const results = [];
    
    for (const post of posts) {
      const analysis = await this.analyzeWithAI(post.content.text);
      results.push({
        postId: post._id,
        ...analysis
      });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  // Content filtering for search results
  static filterSafeContent(posts) {
    return posts.filter(post => 
      post.moderation && 
      post.moderation.status === 'approved' &&
      post.moderation.aiFlag === 'Green Flag'
    );
  }

  // Emergency content scanner for potentially harmful content
  static scanForEmergencyContent(text) {
    const emergencyKeywords = [
      'suicide', 'self harm', 'hurt myself', 'end my life', 'want to die',
      'violence', 'fight', 'hit', 'hurt someone', 'weapon',
      'bullying', 'harassment', 'threatening', 'scared'
    ];
    
    const words = text.toLowerCase();
    const foundKeywords = emergencyKeywords.filter(keyword => words.includes(keyword));
    
    if (foundKeywords.length > 0) {
      return {
        isEmergency: true,
        keywords: foundKeywords,
        action: 'immediate_review_required'
      };
    }
    
    return { isEmergency: false };
  }
}

module.exports = new ContentModerationService(); 