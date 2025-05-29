const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'authorModel'
  },
  authorModel: {
    type: String,
    required: true,
    enum: ['Student', 'Teacher', 'School']
  },
  authorRole: {
    type: String,
    required: true,
    enum: ['student', 'teacher', 'school']
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'likes.userModel'
    },
    userModel: {
      type: String,
      required: true,
      enum: ['Student', 'Teacher', 'School']
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date
}, {
  timestamps: true
});

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'authorModel'
  },
  authorModel: {
    type: String,
    required: true,
    enum: ['Student', 'Teacher', 'School']
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  media: [{
    type: {
      type: String,
      enum: ['image'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    caption: String
  }],
  postType: {
    type: String,
    enum: ['achievement', 'study', 'general', 'notice', 'announcement'],
    default: 'general'
  },
  category: {
    type: String,
    enum: ['academic', 'sports', 'cultural', 'general', 'announcement', 'notice'],
    default: 'general'
  },
  isAchievement: {
    type: Boolean,
    default: false
  },
  achievementDetails: {
    emoji: String,
    year: Number,
    description: String,
    media: [{
      type: String, // URLs
    }]
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'likes.userModel'
    },
    userModel: {
      type: String,
      enum: ['Student', 'Teacher', 'School']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'comments.userModel'
    },
    userModel: {
      type: String,
      enum: ['Student', 'Teacher', 'School']
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'flagged', 'rejected'],
    default: 'pending'
  },
  moderationResult: {
    aiFlag: {
      type: String,
      enum: ['Green Flag', 'Red Flag']
    },
    aiTimestamp: Date,
    schoolApproval: Boolean,
    schoolApprovalTimestamp: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School'
    }
  },
  visibility: {
    type: String,
    enum: ['public', 'school', 'class'],
    default: 'school'
  },
  tags: [String],
  uniqueAddress: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate unique address before saving
postSchema.pre('save', function(next) {
  if (!this.uniqueAddress) {
    this.uniqueAddress = `post-${this._id}-${Date.now()}`;
  }
  next();
});

// Static method to get feed posts for a user
postSchema.statics.getFeedPosts = async function(user, userModel, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  try {
    const posts = await this.aggregate([
      {
        $match: {
          school: user.school,
          status: 'approved',
          author: { $ne: user._id }
        }
      },
      {
        $lookup: {
          from: userModel.toLowerCase() + 's',
          localField: 'author',
          foreignField: '_id',
          as: 'authorData'
        }
      },
      {
        $lookup: {
          from: 'teachers',
          localField: 'author',
          foreignField: '_id',
          as: 'teacherData'
        }
      },
      {
        $lookup: {
          from: 'schools',
          localField: 'author',
          foreignField: '_id',
          as: 'schoolData'
        }
      },
      {
        $addFields: {
          author: {
            $cond: {
              if: { $eq: ['$authorModel', 'Student'] },
              then: { $arrayElemAt: ['$authorData', 0] },
              else: {
                $cond: {
                  if: { $eq: ['$authorModel', 'Teacher'] },
                  then: { $arrayElemAt: ['$teacherData', 0] },
                  else: { $arrayElemAt: ['$schoolData', 0] }
                }
              }
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    return posts;
  } catch (error) {
    console.error('Error in getFeedPosts:', error);
    return [];
  }
};

// Method to toggle like
postSchema.methods.toggleLike = function(userId, userModel) {
  const existingLikeIndex = this.likes.findIndex(
    like => like.user.toString() === userId.toString() && like.userModel === userModel
  );

  if (existingLikeIndex > -1) {
    this.likes.splice(existingLikeIndex, 1);
    return false; // Unlike
  } else {
    this.likes.push({
      user: userId,
      userModel: userModel
    });
    return true; // Like
  }
};

// Method to add comment
postSchema.methods.addComment = function(userId, userModel, content) {
  this.comments.push({
    user: userId,
    userModel: userModel,
    content: content
  });
  return this.comments[this.comments.length - 1];
};

// Method to increment views
postSchema.methods.incrementViews = function(userId, userModel) {
  this.views += 1;
  
  // Track unique views
  const alreadyViewed = this.viewedBy.some(view => 
    view.user && view.user.toString() === userId.toString()
  );
  
  if (!alreadyViewed && userId) {
    this.viewedBy.push({ user: userId, userModel });
  }
};

// Method to approve post
postSchema.methods.approve = function(reviewerId) {
  this.status = 'approved';
  this.publishedAt = new Date();
  this.moderationResult.reviewedBy = reviewerId;
  this.moderationResult.reviewedAt = new Date();
};

// Method to reject post
postSchema.methods.reject = function(reviewerId, reason) {
  this.status = 'rejected';
  this.moderationResult.reviewedBy = reviewerId;
  this.moderationResult.reviewedAt = new Date();
  this.moderationResult.reason = reason;
};

// Ensure virtual fields are serialized
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema); 