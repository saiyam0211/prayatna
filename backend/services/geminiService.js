const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    // Initialize with environment variable
    this.apiKey = process.env.GEMINI_API_KEY;
    
    if (this.apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        this.isConfigured = true;
        console.log('✅ Gemini AI service initialized');
      } catch (error) {
        console.log('⚠️ Gemini AI initialization failed, using fallback:', error.message);
        this.isConfigured = false;
      }
    } else {
      console.log('⚠️ Gemini API key not found, using fallback moderation');
      this.isConfigured = false;
    }
  }

  async moderateContent(content) {
    if (!this.isConfigured) {
      return this.fallbackModeration(content);
    }

    try {
      const prompt = `
        Analyze the following content for appropriateness in an educational platform for students:
        
        Content: "${content}"
        
        Check for:
        1. Inappropriate language or profanity
        2. Harmful or offensive content
        3. Spam or irrelevant content
        4. Educational value
        
        Respond with JSON in this format:
        {
          "isAppropriate": true/false,
          "reason": "explanation if not appropriate",
          "confidence": 0.0-1.0
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const analysis = JSON.parse(text);
        return {
          isAppropriate: analysis.isAppropriate,
          reason: analysis.reason || '',
          confidence: analysis.confidence || 0.8
        };
      } catch (parseError) {
        console.log('Failed to parse Gemini response, using fallback');
        return this.fallbackModeration(content);
      }
    } catch (error) {
      console.log('Gemini moderation failed, using fallback:', error.message);
      return this.fallbackModeration(content);
    }
  }

  fallbackModeration(content) {
    // Simple rule-based fallback moderation
    const inappropriateWords = [
      'spam', 'scam', 'hate', 'violence', 'inappropriate',
      // Add more words as needed
    ];
    
    const lowerContent = content.toLowerCase();
    const hasInappropriateContent = inappropriateWords.some(word => 
      lowerContent.includes(word)
    );
    
    // Check for excessive caps (potential spam)
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    const isExcessiveCaps = capsRatio > 0.7 && content.length > 10;
    
    // Check for very short content
    const isTooShort = content.trim().length < 3;
    
    return {
      isAppropriate: !hasInappropriateContent && !isExcessiveCaps && !isTooShort,
      reason: hasInappropriateContent 
        ? 'Content contains inappropriate language'
        : isExcessiveCaps 
        ? 'Content appears to be spam (excessive caps)'
        : isTooShort
        ? 'Content is too short'
        : '',
      confidence: 0.7
    };
  }

  async healthCheck() {
    return {
      service: 'Gemini AI',
      status: this.isConfigured ? 'connected' : 'fallback',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new GeminiService(); 