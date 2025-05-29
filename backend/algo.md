# Prayatna Platform Algorithms Documentation

This document outlines all the algorithms and calculation methods used in the Prayatna platform for analytics, metrics, and data processing.

## 1. User Engagement Rate Calculation

### Algorithm: Active User Percentage
```
Active Users = Users who logged in within last 7 days
Total Users = All registered users (students + teachers)
Engagement Rate = (Active Users / Total Users) × 100
```

**Implementation Location**: `backend/routes/school.js` - `/analytics` endpoint

**Use Case**: School dashboard to show how engaged their user base is

---

## 2. Post Engagement Rate Calculation

### Algorithm: Post Interaction Rate
```
Total Engagement = Likes + Comments + Shares
Post Views = Number of times post was viewed
Engagement Rate = (Total Engagement / Post Views) × 100
```

**Implementation Location**: `backend/models/Post.js` - Pre-save middleware

**Use Case**: Determine which posts are most engaging for content recommendations

---

## 3. Student Skill Marks Calculation

### Algorithm: Academic Performance Analysis
```
For each subject (Math, English, Science):
1. Extract marks from last 3 marksheets
2. Calculate weighted average: Recent marks get higher weight
3. Normalize to 0-100 scale
4. Apply subject-specific adjustments based on grade level

Weighted Average = (Mark1 × 0.5) + (Mark2 × 0.3) + (Mark3 × 0.2)
Normalized Score = (Weighted Average / Max Possible Marks) × 100
```

**Implementation Location**: `backend/services/aiAnalysis.js` (to be created)

**Use Case**: Generate skill marks for student dashboard after marksheet analysis

---

## 4. Content Moderation Score

### Algorithm: AI Safety Assessment
```
Content Risk Score = Σ(Risk Factor × Weight)

Risk Factors:
- Inappropriate Language: Weight 0.3
- Negative Sentiment: Weight 0.25
- Age Appropriateness: Weight 0.25
- Bullying Indicators: Weight 0.2

If Risk Score > 0.7: Red Flag
If Risk Score ≤ 0.7: Green Flag
```

**Implementation Location**: `backend/services/contentModeration.js` (to be created)

**Use Case**: Automatically flag inappropriate content before it goes live

---

## 5. Student Streak Calculation

### Algorithm: Daily Activity Tracking
```
Current Date = Today
Last Active Date = Student's last login/activity

Day Difference = |Current Date - Last Active Date|

If Day Difference = 0: No change (same day)
If Day Difference = 1: Streak += 1
If Day Difference > 1: Streak = 1 (reset)

Update Longest Streak if Current Streak > Longest Streak
```

**Implementation Location**: `backend/models/Student.js` - `updateStreak()` method

**Use Case**: Gamification to encourage daily platform usage

---

## 6. Activity Feed Relevance Score

### Algorithm: Content Relevance Ranking
```
For each post in feed:

Base Score = 10
Time Decay = e^(-hours_since_post / 24)
Author Relevance = Friend? 2.0 : Classmate? 1.5 : Same School? 1.0 : 0.5
Engagement Boost = (likes + comments) × 0.1
Content Type Boost = Achievement? 1.5 : Study? 1.2 : General? 1.0

Final Score = Base Score × Time Decay × Author Relevance × Content Type Boost + Engagement Boost

Sort posts by Final Score (descending)
```

**Implementation Location**: `backend/services/feedAlgorithm.js` (to be created)

**Use Case**: Personalized feed ranking for better user experience

---

## 7. School Performance Metrics

### Algorithm: Comprehensive School Analytics
```
Total Users = Registered Students + Registered Teachers
Active Users = Users with login in last 7 days
Content Health = Approved Posts / Total Posts
Engagement Quality = Average Comments per Post

School Score Components:
- User Adoption Rate = (Registered Users / Created Accounts) × 25
- Activity Rate = (Active Users / Total Users) × 25  
- Content Quality = Content Health × 25
- Community Engagement = Engagement Quality × 25

Overall School Score = Sum of all components (0-100)
```

**Implementation Location**: `backend/routes/school.js` - `/analytics` endpoint

**Use Case**: School administration dashboard insights

---

## 8. Recommendation Engine - Students You May Know

### Algorithm: Social Graph Recommendation
```
For target student:

Mutual Friends Score = Number of mutual friends × 2
Same Class Score = Same class? 3 : 0
Same Grade Score = Same grade level? 1 : 0
Recent Activity Score = Active in last week? 1 : 0
Interest Overlap = Common interests count × 0.5

Recommendation Score = Mutual Friends Score + Same Class Score + Same Grade Score + Recent Activity Score + Interest Overlap

Filter: Score > 2.0
Sort by Score (descending)
Limit to top 10 recommendations
```

**Implementation Location**: `backend/services/recommendations.js` (to be created)

**Use Case**: Network page student suggestions

---

## 9. Notification Priority Algorithm

### Algorithm: Notification Importance Ranking
```
Base Priority Scores:
- Achievement notifications: 10
- Direct mentions/comments: 8
- Friend requests: 6
- Likes on posts: 4
- System notifications: 3

Time Decay = max(0.1, 1 - (hours_since_event / 168)) // 7 days max decay
Author Relationship = Friend? 1.5 : Classmate? 1.2 : Teacher? 2.0 : 1.0

Final Priority = Base Priority × Time Decay × Author Relationship

Sort notifications by Final Priority (descending)
Show top 20 in notification panel
```

**Implementation Location**: `backend/services/notifications.js` (to be created)

**Use Case**: Smart notification ordering in notification panel

---

## 10. Content Safety Prediction

### Algorithm: Pre-emptive Content Analysis
```
Text Analysis Factors:
- Profanity Detection: Binary (0 or 1)
- Sentiment Score: -1 (very negative) to +1 (very positive)  
- Age Appropriateness: Boolean assessment
- Social Context: School environment suitability

Safety Score = 0.4 × (1 - Profanity) + 0.3 × ((Sentiment + 1) / 2) + 0.2 × Age Appropriate + 0.1 × Social Context

If Safety Score > 0.7: Auto-approve (Green Flag)
If Safety Score ≤ 0.7: Manual review required (Red Flag)
```

**Implementation Location**: `backend/services/contentModeration.js`

**Use Case**: Automated content moderation before human review

---

## Implementation Notes

### Performance Considerations
- All algorithms are designed to run efficiently on MongoDB aggregation pipelines where possible
- Caching strategies implemented for frequently calculated metrics
- Batch processing for analytics that don't require real-time updates

### Scalability
- Algorithms are designed to handle up to 10,000 students per school
- Background job processing for heavy calculations
- Database indexing optimized for algorithm queries

### Privacy & Safety
- All algorithms respect user privacy settings
- Age-appropriate content filtering built into every recommendation
- Transparent scoring systems that can be audited

### Future Enhancements
- Machine learning models for improved content moderation
- Collaborative filtering for better recommendations  
- Predictive analytics for student performance trends
- Real-time engagement optimization 

## 1. User Engagement Rate Algorithm

### Purpose
Calculate the engagement rate for students, teachers, and the overall school community.

### Formula
```
Engagement Rate = (Total Interactions / Total Users) * 100

Where:
- Total Interactions = Likes + Comments + Shares + Post Creates + Profile Updates
- Total Users = Active Users in the time period
```

### Detailed Calculation
```javascript
function calculateEngagementRate(users, timePeriod = 30) {
  const totalUsers = users.length;
  let totalInteractions = 0;
  
  users.forEach(user => {
    const recentActivity = getRecentActivity(user, timePeriod);
    totalInteractions += recentActivity.posts * 3; // Weight: 3 points per post
    totalInteractions += recentActivity.likes * 1; // Weight: 1 point per like
    totalInteractions += recentActivity.comments * 2; // Weight: 2 points per comment
    totalInteractions += recentActivity.shares * 2; // Weight: 2 points per share
    totalInteractions += recentActivity.achievements * 5; // Weight: 5 points per achievement
  });
  
  return Math.round((totalInteractions / (totalUsers * 100)) * 100); // Normalized to percentage
}
```

## 2. Active Users Prediction Algorithm

### Purpose
Predict and identify active users based on their engagement patterns and behavior.

### Classification Criteria
- **Highly Active**: 15+ interactions in last 7 days
- **Active**: 5-14 interactions in last 7 days  
- **Moderately Active**: 1-4 interactions in last 7 days
- **Inactive**: 0 interactions in last 7 days

### Algorithm Implementation
```javascript
function predictActiveUsers(users) {
  const predictions = {
    highlyActive: 0,
    active: 0,
    moderatelyActive: 0,
    inactive: 0
  };
  
  users.forEach(user => {
    const weeklyScore = calculateWeeklyActivityScore(user);
    const streakBonus = user.streak.currentStreak * 0.1;
    const profileCompletionBonus = user.profile.isProfileComplete ? 5 : 0;
    
    const totalScore = weeklyScore + streakBonus + profileCompletionBonus;
    
    if (totalScore >= 15) predictions.highlyActive++;
    else if (totalScore >= 5) predictions.active++;
    else if (totalScore >= 1) predictions.moderatelyActive++;
    else predictions.inactive++;
  });
  
  return predictions;
}

function calculateWeeklyActivityScore(user) {
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const recentPosts = user.posts.filter(post => post.createdAt >= lastWeek).length;
  const recentLogins = user.loginHistory.filter(login => login >= lastWeek).length;
  const recentAchievements = user.achievements.filter(ach => ach.createdAt >= lastWeek).length;
  
  return (recentPosts * 3) + (recentLogins * 1) + (recentAchievements * 5);
}
```

## 3. Post Interaction Score Algorithm

### Purpose
Calculate interaction scores for posts to determine their popularity and relevance.

### Formula
```
Interaction Score = (Likes × 1) + (Comments × 2) + (Shares × 3) + (Views × 0.1)
Time Decay Factor = e^(-0.1 × hours_since_post)
Final Score = Interaction Score × Time Decay Factor
```

### Implementation
```javascript
function calculatePostScore(post) {
  const likes = post.likes.length;
  const comments = post.comments.length;
  const shares = post.shares.length;
  const views = post.metrics.views;
  
  const interactionScore = (likes * 1) + (comments * 2) + (shares * 3) + (views * 0.1);
  
  const hoursOld = (Date.now() - post.createdAt) / (1000 * 60 * 60);
  const timeDecay = Math.exp(-0.1 * hoursOld);
  
  return Math.round(interactionScore * timeDecay * 100) / 100;
}
```

## 4. Student Skill Marks Calculation Algorithm

### Purpose
Calculate student skill marks based on marksheet analysis and educational performance.

### Algorithm
```javascript
function calculateSkillMarks(marksheetData) {
  const subjects = ['mathematics', 'english', 'science'];
  const skillMarks = {};
  
  subjects.forEach(subject => {
    let totalMarks = 0;
    let totalMaxMarks = 0;
    let validEntries = 0;
    
    marksheetData.forEach(marksheet => {
      if (marksheet.subjects[subject]) {
        totalMarks += marksheet.subjects[subject].obtainedMarks;
        totalMaxMarks += marksheet.subjects[subject].maxMarks;
        validEntries++;
      }
    });
    
    if (validEntries > 0) {
      const percentage = (totalMarks / totalMaxMarks) * 100;
      const improvementFactor = calculateImprovementTrend(marksheetData, subject);
      
      // Apply improvement bonus (max 10% boost)
      skillMarks[subject] = Math.min(100, Math.round(percentage * (1 + improvementFactor)));
    } else {
      skillMarks[subject] = 0;
    }
  });
  
  return skillMarks;
}

function calculateImprovementTrend(marksheetData, subject) {
  if (marksheetData.length < 2) return 0;
  
  const sortedData = marksheetData
    .filter(m => m.subjects[subject])
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
  
  if (sortedData.length < 2) return 0;
  
  const firstPercent = (sortedData[0].subjects[subject].obtainedMarks / 
                       sortedData[0].subjects[subject].maxMarks) * 100;
  const lastPercent = (sortedData[sortedData.length - 1].subjects[subject].obtainedMarks / 
                      sortedData[sortedData.length - 1].subjects[subject].maxMarks) * 100;
  
  const improvement = (lastPercent - firstPercent) / 100;
  return Math.max(-0.1, Math.min(0.1, improvement)); // Limit between -10% and +10%
}
```

## 5. Content Safety Score Algorithm

### Purpose
Evaluate content safety for the school environment using AI and rule-based analysis.

### Formula
```
Safety Score = 0.4 × (1 - Profanity Score) + 
               0.3 × ((Sentiment Score + 1) / 2) + 
               0.2 × Age Appropriate Score + 
               0.1 × Social Context Score
```

### Implementation
```javascript
function calculateSafetyScore(analysis) {
  const profanityScore = analysis.profanityScore; // 0 = no profanity, 1 = profanity
  const sentimentScore = analysis.sentimentScore; // -1 to 1 scale
  const ageAppropriate = analysis.ageAppropriate ? 1 : 0; // boolean to numeric
  const socialContext = analysis.socialContext ? 1 : 0; // boolean to numeric
  
  const score = 
    0.4 * (1 - profanityScore) +
    0.3 * ((sentimentScore + 1) / 2) +
    0.2 * ageAppropriate +
    0.1 * socialContext;
  
  return Math.round(score * 100) / 100;
}
```

## 6. Streak Calculation Algorithm

### Purpose
Track and maintain student activity streaks for engagement motivation.

### Algorithm
```javascript
function updateStreak(student) {
  const today = new Date();
  const lastActive = student.streak.lastActiveDate;
  
  if (!lastActive) {
    // First activity
    student.streak.currentStreak = 1;
    student.streak.lastActiveDate = today;
    return;
  }
  
  const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) {
    // Same day, no change
    return;
  } else if (daysDiff === 1) {
    // Consecutive day
    student.streak.currentStreak++;
    student.streak.lastActiveDate = today;
    
    // Update best streak if current is higher
    if (student.streak.currentStreak > student.streak.bestStreak) {
      student.streak.bestStreak = student.streak.currentStreak;
    }
  } else {
    // Streak broken
    student.streak.currentStreak = 1;
    student.streak.lastActiveDate = today;
  }
}
```

## 7. Feed Relevance Algorithm

### Purpose
Rank posts in user feeds based on relevance, recency, and engagement.

### Formula
```
Relevance Score = Author Relationship Score × 0.4 + 
                  Content Relevance Score × 0.3 + 
                  Engagement Score × 0.2 + 
                  Recency Score × 0.1
```

### Implementation
```javascript
function calculateFeedRelevance(post, viewer) {
  // Author relationship (0-1 scale)
  const authorRelationship = calculateAuthorRelationship(post.author, viewer);
  
  // Content relevance based on viewer's interests
  const contentRelevance = calculateContentRelevance(post, viewer);
  
  // Engagement score (normalized)
  const engagementScore = Math.min(1, calculatePostScore(post) / 100);
  
  // Recency score (higher for newer posts)
  const hoursOld = (Date.now() - post.createdAt) / (1000 * 60 * 60);
  const recencyScore = Math.exp(-0.05 * hoursOld);
  
  return (authorRelationship * 0.4) + 
         (contentRelevance * 0.3) + 
         (engagementScore * 0.2) + 
         (recencyScore * 0.1);
}

function calculateAuthorRelationship(author, viewer) {
  if (author.id.toString() === viewer._id.toString()) return 1.0; // Own post
  if (author.model === 'Teacher') return 0.8; // Teacher posts get priority
  if (author.model === 'School') return 0.9; // School posts get highest priority
  if (viewer.friends && viewer.friends.includes(author.id)) return 0.7; // Friend's post
  return 0.4; // Default for classmates
}

function calculateContentRelevance(post, viewer) {
  const viewerInterests = viewer.profile.interests || [];
  const postTags = post.tags || [];
  
  const matchingTags = postTags.filter(tag => 
    viewerInterests.some(interest => 
      interest.toLowerCase().includes(tag.toLowerCase()) ||
      tag.toLowerCase().includes(interest.toLowerCase())
    )
  );
  
  const relevanceScore = matchingTags.length / Math.max(1, postTags.length);
  return Math.min(1, relevanceScore * 2); // Boost matching content
}
```

## 8. Performance Metrics Calculation

### Purpose
Calculate various performance metrics for the school dashboard analytics.

### Key Metrics

#### Average Response Time
```javascript
function calculateAverageResponseTime(interactions) {
  const responseTimes = interactions
    .filter(interaction => interaction.responseTime)
    .map(interaction => interaction.responseTime);
  
  return responseTimes.length > 0 
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    : 0;
}
```

#### Content Quality Score
```javascript
function calculateContentQualityScore(posts) {
  let totalScore = 0;
  let validPosts = 0;
  
  posts.forEach(post => {
    if (post.moderation && post.moderation.safetyScore) {
      totalScore += post.moderation.safetyScore;
      validPosts++;
    }
  });
  
  return validPosts > 0 ? (totalScore / validPosts) * 100 : 0;
}
```

#### User Growth Rate
```javascript
function calculateGrowthRate(currentUsers, previousUsers, timePeriod) {
  if (previousUsers === 0) return 100; // 100% growth from 0
  
  const growthRate = ((currentUsers - previousUsers) / previousUsers) * 100;
  return Math.round(growthRate * 100) / 100;
}
```

## Algorithm Performance Notes

1. **Time Complexity**: Most algorithms are O(n) where n is the number of users/posts
2. **Space Complexity**: O(1) additional space for calculations
3. **Update Frequency**: 
   - Engagement rates: Calculated daily
   - Active user predictions: Calculated hourly
   - Post scores: Calculated on each interaction
   - Skill marks: Calculated on marksheet upload

## Future Enhancements

1. **Machine Learning Integration**: Use ML models for better user behavior prediction
2. **Advanced NLP**: Implement more sophisticated content analysis
3. **Collaborative Filtering**: Recommend content based on similar users
4. **Predictive Analytics**: Forecast user engagement trends
5. **A/B Testing Framework**: Test algorithm variations for optimization 