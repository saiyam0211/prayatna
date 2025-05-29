import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Camera, Image, Video, Calendar, Smile, Send, ThumbsUp, Award, MapPin, GraduationCap, Users, TrendingUp, Plus, Globe, Lock, Zap, Settings, Sparkles } from 'lucide-react';

type PostType = 'achievement' | 'project' | 'study' | 'general';

interface User {
  name: string;
  grade: string;
  school: string;
  avatar: string;
  isVerified: boolean;
}

interface Post {
  id: number;
  user: User;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  type: PostType;
}

const ExplorePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<PostType>('general');
  const [showComments, setShowComments] = useState<number | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

  const currentUser = {
    name: 'Sam Wilson',
    grade: '11th Grade',
    school: 'Lincoln High School',
    avatar: '😊',
    followers: 234,
    following: 189,
    posts: 47,
    achievements: ['Honor Roll', 'Debate Champion', 'Coding Club Leader'],
    isVerified: false
  };

  // Initial sample posts
  const initialPosts: Post[] = [
    {
      id: 1,
      user: {
        name: 'Alex Chen',
        grade: '12th Grade',
        school: 'Lincoln High School',
        avatar: '🎯',
        isVerified: true
      },
      content: 'Just finished building my first AI chatbot for our computer science project! 🤖 It can help students with homework questions and study tips. Super excited to present this next week!',
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=200&fit=crop',
      timestamp: '2 hours ago',
      likes: 42,
      comments: 8,
      shares: 3,
      isLiked: false,
      isBookmarked: false,
      type: 'achievement'
    },
    {
      id: 2,
      user: {
        name: 'Maya Patel',
        grade: '11th Grade',
        school: 'Roosevelt Academy',
        avatar: '🌟',
        isVerified: false
      },
      content: 'Amazing robotics workshop today! 🤖✨ Learned so much about Arduino programming and sensor integration. Our team is building an autonomous cleaning robot for the school hallways. Technology is incredible! #STEM #Robotics',
      image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=400&fit=crop',
      timestamp: '4 hours ago',
      likes: 67,
      comments: 12,
      shares: 5,
      isLiked: true,
      isBookmarked: true,
      type: 'project'
    },
    {
      id: 3,
      user: {
        name: 'Jordan Kim',
        grade: '10th Grade',
        school: 'Central High',
        avatar: '📚',
        isVerified: false
      },
      content: 'Study group forming for AP Chemistry! 🧪 We meet every Tuesday and Thursday at the library. Already have 6 people committed. DM me if you want to join - we make learning fun with flashcards, practice tests, and group discussions!',
      timestamp: '6 hours ago',
      likes: 23,
      comments: 15,
      shares: 8,
      isLiked: false,
      isBookmarked: false,
      type: 'study'
    },
    {
      id: 4,
      user: {
        name: 'Emma Rodriguez',
        grade: '12th Grade',
        school: 'Westfield High',
        avatar: '🎨',
        isVerified: true
      },
      content: 'Won first place at the Regional Art Competition! 🏆🎨 My piece "Digital Dreams" explores the intersection of technology and human creativity. Thanks to everyone who supported me on this journey!',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
      timestamp: '1 day ago',
      likes: 156,
      comments: 24,
      shares: 12,
      isLiked: true,
      isBookmarked: true,
      type: 'achievement'
    }
  ];

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('prayatna_posts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
      } catch (error) {
        console.error('Error loading posts from localStorage:', error);
        setPosts(initialPosts);
        localStorage.setItem('prayatna_posts', JSON.stringify(initialPosts));
      }
    } else {
      setPosts(initialPosts);
      localStorage.setItem('prayatna_posts', JSON.stringify(initialPosts));
    }
  }, []);

  // Save posts to localStorage whenever posts state changes
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('prayatna_posts', JSON.stringify(posts));
    }
  }, [posts]);

  // Function to format timestamp
  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Function to show toast notifications
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-4 px-6 py-3 rounded-xl shadow-lg z-50 transition-all transform ${
      type === 'success' 
        ? 'bg-green-500 text-white animate-bounce' 
        : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(400px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // Function to handle AI rewrite
  const handleAIRewrite = async () => {
    if (!newPost.trim()) {
      showToast('❌ Please write some content first before using AI rewrite!', 'error');
      return;
    }
    
    setIsRewriting(true);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI enhancement - in a real app, this would call an AI API
      const enhancements = {
        'general': [
          'Hey everyone! 🌟 ',
          'Just wanted to share this amazing experience! ✨ ',
          'Excited to tell you all about ',
          'Can\'t wait to share this with the community! 🎉 '
        ],
        'achievement': [
          'I\'m thrilled to announce that I just ',
          '🏆 Proud moment alert! I successfully ',
          'Feeling incredibly grateful - I just achieved ',
          '✨ Amazing news! I\'m excited to share that I '
        ],
        'project': [
          '🚀 Project update! I\'ve been working on ',
          'Super excited about this new project: ',
          '💡 Innovation in progress! Currently building ',
          '🔥 Passionate about this latest creation: '
        ],
        'study': [
          '📚 Study session success! Just completed ',
          '🎓 Learning journey update: ',
          '💪 Academic milestone reached! ',
          '🧠 Knowledge gained from '
        ]
      };
      
      const postEndings = [
        ' Looking forward to hearing your thoughts! 💭',
        ' Would love to connect with others interested in this! 🤝',
        ' Excited to share more updates soon! 📈',
        ' Feel free to ask any questions! ❓',
        ' Can\'t wait to see what\'s next! 🌟',
        ' Thanks for all the support along the way! 🙏'
      ];
      
      // Get random enhancement based on post type
      const typeEnhancements = enhancements[postType] || enhancements.general;
      const randomStart = typeEnhancements[Math.floor(Math.random() * typeEnhancements.length)];
      const randomEnd = postEndings[Math.floor(Math.random() * postEndings.length)];
      
      // Clean up the original post and enhance it
      let enhancedPost = newPost.trim();
      
      // Add engaging start if it doesn't already have one
      if (!enhancedPost.match(/^(Hey|Hi|Excited|Amazing|Just|I'm|Super|Thrilled)/i)) {
        enhancedPost = randomStart + enhancedPost.toLowerCase();
      }
      
      // Ensure proper capitalization after punctuation
      enhancedPost = enhancedPost.replace(/([.!?]\s*)([a-z])/g, (match, punctuation, letter) => 
        punctuation + letter.toUpperCase()
      );
      
      // Add engaging ending if it doesn't already have one
      if (!enhancedPost.match(/[.!?]$/)) {
        enhancedPost += '!';
      }
      
      if (!enhancedPost.includes('looking forward') && 
          !enhancedPost.includes('feel free') && 
          !enhancedPost.includes('would love') &&
          !enhancedPost.includes('thanks') &&
          !enhancedPost.includes('excited')) {
        enhancedPost += randomEnd;
      }
      
      // Update the post content
      setNewPost(enhancedPost);
      showToast('✨ Post enhanced with AI! Review and edit as needed.', 'success');
      
    } catch (error) {
      console.error('Error with AI rewrite:', error);
      showToast('❌ AI rewrite failed. Please try again.', 'error');
    } finally {
      setIsRewriting(false);
    }
  };

  // Function to create a new post
  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    setIsPosting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPostData: Post = {
        id: Date.now(), // Simple ID generation
        user: currentUser,
        content: newPost.trim(),
        timestamp: formatTimestamp(new Date()),
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        type: postType
      };

      // Add new post to the beginning of the posts array
      setPosts(prevPosts => [newPostData, ...prevPosts]);
      
      // Clear the form
      setNewPost('');
      setPostType('general');
      
      showToast('✅ Post created successfully!', 'success');
      
    } catch (error) {
      console.error('Error creating post:', error);
      showToast('❌ Failed to create post. Please try again.', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  // Function to clear all posts (for testing)
  const handleClearPosts = () => {
    if (window.confirm('Are you sure you want to clear all posts? This action cannot be undone.')) {
      setPosts([]);
      localStorage.removeItem('prayatna_posts');
      showToast('🗑️ All posts cleared!', 'success');
    }
  };

  // Function to reset to initial posts
  const handleResetPosts = () => {
    setPosts(initialPosts);
    localStorage.setItem('prayatna_posts', JSON.stringify(initialPosts));
    showToast('🔄 Posts reset to initial state!', 'success');
  };

  const handleLike = (postId: number) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: number) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  const getPostTypeIcon = (type: PostType) => {
    switch (type) {
      case 'achievement': return <Award className="w-4 h-4 text-yellow-500" />;
      case 'project': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'study': return <GraduationCap className="w-4 h-4 text-green-500" />;
      default: return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPostTypeBadge = (type: PostType) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'project': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'study': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-3">
            <div className="sticky top-6 space-y-6">
              {/* Enhanced Profile Card */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                {/* Animated Cover */}
                <div className="h-24 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse"></div>
                  <div className="absolute top-4 right-4">
                    <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Profile Info */}
                <div className="px-6 pb-6">
                  <div className="flex flex-col items-center -mt-12">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full bg-white p-1 shadow-xl">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-3xl transform transition-transform group-hover:scale-105">
                          {currentUser.avatar}
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <h3 className="mt-4 font-bold text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {currentUser.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">{currentUser.grade}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1 font-medium">
                      <MapPin className="w-3 h-3 mr-1" />
                      {currentUser.school}
                    </p>
                    
                    <button className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                      Edit Profile
                    </button>
                  </div>
                  
                  {/* Enhanced Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center group cursor-pointer">
                      <div className="font-bold text-xl bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                        {currentUser.posts}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Posts</div>
                    </div>
                    <div className="text-center group cursor-pointer">
                      <div className="font-bold text-xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                        {currentUser.followers}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Followers</div>
                    </div>
                    <div className="text-center group cursor-pointer">
                      <div className="font-bold text-xl bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                        {currentUser.following}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Following</div>
                    </div>
                  </div>
                  
                  {/* Enhanced Achievements */}
                  <div className="mt-6">
                    <h4 className="font-bold text-sm text-gray-800 mb-3 flex items-center">
                      <Award className="w-4 h-4 mr-2 text-yellow-500" />
                      Achievements
                    </h4>
                    <div className="space-y-2">
                      {currentUser.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 transition-colors cursor-pointer">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                            <span className="text-white text-xs">🏆</span>
                          </div>
                          <span className="text-xs text-gray-700 font-medium">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Quick Stats Card */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-gray-800 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                    This Week
                  </h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Activity</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors">
                    <span className="text-sm text-gray-700 font-medium">Posts Created</span>
                    <span className="font-bold text-lg text-green-600">{posts.filter(post => post.user.name === currentUser.name).length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors">
                    <span className="text-sm text-gray-700 font-medium">Total Posts</span>
                    <span className="font-bold text-lg text-purple-600">{posts.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors">
                    <span className="text-sm text-gray-700 font-medium">Total Likes</span>
                    <span className="font-bold text-lg text-blue-600">{posts.reduce((sum, post) => sum + post.likes, 0)}</span>
                  </div>
                </div>
              </div>

              {/* Developer Tools Card */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-gray-800 flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-blue-500" />
                    Developer Tools
                  </h4>
                  <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">Debug</span>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleResetPosts}
                    className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors text-blue-700 font-medium"
                  >
                    <span>🔄</span>
                    <span className="text-sm">Reset Posts</span>
                  </button>
                  <button
                    onClick={handleClearPosts}
                    className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-colors text-red-700 font-medium"
                  >
                    <span>🗑️</span>
                    <span className="text-sm">Clear All Posts</span>
                  </button>
                  <div className="text-xs text-gray-500 text-center mt-3 p-2 bg-gray-50 rounded-lg">
                    Posts are stored in localStorage
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Posts Feed */}
          <div className="lg:col-span-9">
            <div className="space-y-6">
              
              {/* Enhanced Create Post Card */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl transform hover:scale-105 transition-transform">
                      {currentUser.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    {/* Post Type Selection */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm font-medium text-gray-600">Post Type:</span>
                      <div className="flex items-center space-x-2">
                        {[
                          { type: 'general' as PostType, label: 'General', icon: '💬', color: 'gray' },
                          { type: 'achievement' as PostType, label: 'Achievement', icon: '🏆', color: 'yellow' },
                          { type: 'project' as PostType, label: 'Project', icon: '🚀', color: 'blue' },
                          { type: 'study' as PostType, label: 'Study', icon: '📚', color: 'green' }
                        ].map((typeOption) => (
                          <button
                            key={typeOption.type}
                            onClick={() => setPostType(typeOption.type)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${
                              postType === typeOption.type
                                ? `bg-${typeOption.color}-100 text-${typeOption.color}-800 border-2 border-${typeOption.color}-300 transform scale-105`
                                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                            }`}
                          >
                            <span>{typeOption.icon}</span>
                            <span>{typeOption.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Share something amazing with your classmates... ✨"
                        className="w-full resize-none border-none outline-none text-gray-700 placeholder-gray-400 text-lg leading-relaxed bg-gray-50 rounded-2xl p-4 focus:bg-white focus:shadow-md transition-all duration-200"
                        rows={3}
                        disabled={isPosting}
                      />
                      <div className="absolute top-4 right-4">
                        <Smile className="w-5 h-5 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
                      </div>
                    </div>
                    
                    {/* Character Count */}
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-gray-400">
                        {newPost.length}/500 characters
                      </div>
                      {newPost.length > 450 && (
                        <div className="text-xs text-orange-500 font-medium">
                          {500 - newPost.length} characters remaining
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center space-x-6">
                        <button 
                          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-all duration-200 transform hover:scale-105 group"
                          disabled={isPosting}
                        >
                          <div className="p-2 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                            <Camera className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium">Photo</span>
                        </button>
                        <button 
                          className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-all duration-200 transform hover:scale-105 group"
                          disabled={isPosting}
                        >
                          <div className="p-2 rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors">
                            <Video className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium">Video</span>
                        </button>
                        <button 
                          onClick={handleAIRewrite}
                          disabled={!newPost.trim() || isRewriting || isPosting}
                          className="flex items-center space-x-2 text-gray-500 hover:text-purple-500 transition-all duration-200 transform hover:scale-105 group disabled:opacity-50"
                        >
                          <div className="p-2 rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-colors">
                            {isRewriting ? (
                              <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Sparkles className="w-5 h-5" />
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {isRewriting ? 'Rewriting...' : 'Rewrite with AI'}
                          </span>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={handleCreatePost}
                          disabled={!newPost.trim() || newPost.length > 500 || isPosting}
                          className={`px-8 py-3 rounded-xl text-white font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl flex items-center space-x-2 ${
                            isPosting ? 'cursor-not-allowed' : ''
                          }`}
                          style={{ 
                            background: newPost.trim() && newPost.length <= 500 && !isPosting
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                              : '#e5e7eb'
                          }}
                        >
                          {isPosting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Posting...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Post</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Posts Feed */}
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Enhanced Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl hover:scale-105 transition-transform cursor-pointer">
                            {post.user.avatar}
                          </div>
                          {post.user.isVerified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                              {post.user.name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1.5 ${getPostTypeBadge(post.type)}`}>
                              {getPostTypeIcon(post.type)}
                              <span className="capitalize">{post.type}</span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-medium">{post.user.grade} • {post.user.school}</p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center">
                            <Globe className="w-3 h-3 mr-1" />
                            {post.timestamp}
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-50">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Post Content */}
                  <div className="px-6 pb-4">
                    <p className="text-gray-800 leading-relaxed text-lg text-left">
                      {post.content}
                    </p>
                  </div>

                  {/* Enhanced Post Image */}
                  {post.image && (
                    <div className="px-6 pb-4">
                      <div className="relative group overflow-hidden rounded-2xl">
                        <img 
                          src={post.image} 
                          alt="Post content"
                          className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl"></div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Engagement Stats */}
                  <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-6">
                        <span className="flex items-center space-x-1 hover:text-red-500 cursor-pointer transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="font-medium">{post.likes} likes</span>
                        </span>
                        <span className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-medium">{post.comments} comments</span>
                        </span>
                      </div>
                      <span className="flex items-center space-x-1 hover:text-green-500 cursor-pointer transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span className="font-medium">{post.shares} shares</span>
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 font-medium ${
                            post.isLiked 
                              ? 'text-red-500 bg-red-50 shadow-lg shadow-red-500/20' 
                              : 'text-gray-600 hover:bg-red-50 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span>Like</span>
                        </button>
                        
                        <button 
                          onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                          className="flex items-center space-x-2 px-6 py-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-500 transition-all duration-200 transform hover:scale-105 font-medium"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>Comment</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 px-6 py-3 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-500 transition-all duration-200 transform hover:scale-105 font-medium">
                          <Share2 className="w-5 h-5" />
                          <span>Share</span>
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => handleBookmark(post.id)}
                        className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                          post.isBookmarked 
                            ? 'text-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20' 
                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Comments Section */}
                  {showComments === post.id && (
                    <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50/50">
                      <div className="mt-6 space-y-6">
                        {/* Enhanced Comment Input */}
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xl">
                            {currentUser.avatar}
                          </div>
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              placeholder="Write a thoughtful comment... 💭"
                              className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
                            />
                            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-xl hover:bg-blue-50">
                              <Send className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Enhanced Sample Comments */}
                        <div className="space-y-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-lg">
                              🤓
                            </div>
                            <div className="flex-1">
                              <div className="bg-white rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-shadow">
                                <p className="font-bold text-sm text-gray-900 mb-1">Sarah Johnson</p>
                                <p className="text-sm text-gray-700 leading-relaxed">This is amazing! Great work 👏 Your dedication really shows!</p>
                              </div>
                              <div className="flex items-center space-x-6 mt-3 ml-6">
                                <button className="text-xs text-gray-500 hover:text-blue-500 font-medium transition-colors">Like</button>
                                <button className="text-xs text-gray-500 hover:text-blue-500 font-medium transition-colors">Reply</button>
                                <span className="text-xs text-gray-400">2h ago</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-lg">
                              🚀
                            </div>
                            <div className="flex-1">
                              <div className="bg-white rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-shadow">
                                <p className="font-bold text-sm text-gray-900 mb-1">Mike Thompson</p>
                                <p className="text-sm text-gray-700 leading-relaxed">Would love to collaborate on something similar! 🤝</p>
                              </div>
                              <div className="flex items-center space-x-6 mt-3 ml-6">
                                <button className="text-xs text-gray-500 hover:text-blue-500 font-medium transition-colors">Like</button>
                                <button className="text-xs text-gray-500 hover:text-blue-500 font-medium transition-colors">Reply</button>
                                <span className="text-xs text-gray-400">1h ago</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;