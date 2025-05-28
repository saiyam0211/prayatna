import React, { useState } from 'react';
import { Bell, Users, GraduationCap, UserCheck, MessageCircle, Trophy, Eye, Check, X, Heart, MessageSquare, Clock } from 'lucide-react';

type NotificationType = 'achievement' | 'post' | 'friend_request' | 'comment' | 'announcement';
type VariantType = 'school' | 'teacher' | 'student';

interface BaseNotification {
  id: number;
  type: NotificationType;
  variant: VariantType;
  user: string;
  avatar: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}

interface AchievementNotification extends BaseNotification {
  type: 'achievement';
  celebrateCount: number;
  isCelebrated: boolean;
}

interface PostNotification extends BaseNotification {
  type: 'post';
  commentCount: number;
}

interface CommentNotification extends BaseNotification {
  type: 'comment';
  postTitle: string;
}

interface FriendRequestNotification extends BaseNotification {
  type: 'friend_request';
}

interface AnnouncementNotification extends BaseNotification {
  type: 'announcement';
}

type Notification = 
  | AchievementNotification 
  | PostNotification 
  | CommentNotification 
  | FriendRequestNotification 
  | AnnouncementNotification;

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'achievement',
      variant: 'school',
      user: 'MIT Computer Science',
      avatar: '🎓',
      title: 'New Research Publication Achievement',
      content: 'Our research team has published a breakthrough paper on AI ethics in Nature Journal',
      time: '2 hours ago',
      isRead: false,
      celebrateCount: 24,
      isCelebrated: false
    },
    {
      id: 2,
      type: 'post',
      variant: 'teacher',
      user: 'Prof. Sarah Johnson',
      avatar: '👩‍🏫',
      title: 'Assignment Reminder',
      content: 'Don\'t forget to submit your machine learning projects by Friday. Good luck everyone!',
      time: '4 hours ago',
      isRead: false,
      commentCount: 12
    },
    {
      id: 3,
      type: 'achievement',
      variant: 'student',
      user: 'Alex Chen',
      avatar: '🎯',
      title: 'Hackathon Winner!',
      content: 'Just won first place at the National Coding Championship! 🏆',
      time: '6 hours ago',
      isRead: true,
      celebrateCount: 89,
      isCelebrated: true
    },
    {
      id: 4,
      type: 'friend_request',
      variant: 'student',
      user: 'Emma Rodriguez',
      avatar: '👋',
      title: 'Friend Request',
      content: 'Wants to connect with you',
      time: '1 day ago',
      isRead: false
    },
    {
      id: 5,
      type: 'comment',
      variant: 'student',
      user: 'Mike Thompson',
      avatar: '💬',
      title: 'Commented on your post',
      content: 'Great insights about React hooks! Thanks for sharing.',
      time: '1 day ago',
      isRead: false,
      postTitle: 'React Hooks Best Practices'
    },
    {
      id: 6,
      type: 'announcement',
      variant: 'school',
      user: 'Campus Administration',
      avatar: '📢',
      title: 'Campus Event Notice',
      content: 'Annual Tech Symposium scheduled for next month. Registration opens tomorrow.',
      time: '2 days ago',
      isRead: true
    },
    {
      id: 7,
      type: 'post',
      variant: 'student',
      user: 'Jordan Kim',
      avatar: '📚',
      title: 'Study Group Formation',
      content: 'Looking for study partners for the upcoming algorithms exam. Anyone interested?',
      time: '3 days ago',
      isRead: true,
      commentCount: 8
    }
  ]);

  const [filter, setFilter] = useState<'all' | VariantType>('all');

  const handleCelebrate = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => {
        if (notif.id === notificationId && notif.type === 'achievement') {
          return { 
            ...notif, 
            isCelebrated: !notif.isCelebrated,
            celebrateCount: notif.isCelebrated ? notif.celebrateCount - 1 : notif.celebrateCount + 1
          };
        }
        return notif;
      })
    );
  };

  const handleFriendRequest = (notificationId: number, action: 'accept' | 'decline') => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
    // Here you would typically make an API call to accept/decline the friend request
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const getVariantIcon = (variant: VariantType) => {
    switch (variant) {
      case 'school': return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'teacher': return <Users className="w-4 h-4 text-purple-600" />;
      case 'student': return <UserCheck className="w-4 h-4 text-green-600" />;
    }
  };

  const getVariantBadge = (variant: VariantType) => {
    switch (variant) {
      case 'school': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'teacher': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'student': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(notif => notif.variant === filter);

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10 transition-all duration-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute -inset-2 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <Bell className="w-7 h-7 relative" style={{ color: '#4BA3C7' }} />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex space-x-2">
            {['all', 'school', 'teacher', 'student'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption as 'all' | VariantType)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  filter === filterOption
                    ? 'text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: filter === filterOption ? '#4BA3C7' : 'transparent'
                }}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl p-6 border transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
                !notification.isRead 
                  ? 'border-blue-200 bg-blue-50/30 shadow-lg shadow-blue-500/10' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl relative transform transition-transform group-hover:scale-105 ${
                    notification.variant === 'school' ? 'from-blue-100 to-blue-200' :
                    notification.variant === 'teacher' ? 'from-purple-100 to-purple-200' :
                    'from-green-100 to-green-200'
                  }`}>
                    {notification.avatar}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors cursor-pointer">
                      {notification.user}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1.5 transition-colors ${getVariantBadge(notification.variant)}`}>
                      {getVariantIcon(notification.variant)}
                      <span>{notification.variant}</span>
                    </span>
                    {!notification.isRead && (
                      <span className="flex items-center space-x-1.5 text-xs font-medium text-blue-600">
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                        <span>New</span>
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-gray-800 mb-2 hover:text-blue-600 transition-colors cursor-pointer text-left">
                    {notification.title}
                  </h4>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed text-left">
                    {notification.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{notification.time}</span>
                    </span>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      {notification.type === 'achievement' && (
                        <>
                          <button 
                            onClick={() => handleCelebrate(notification.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                              notification.isCelebrated 
                                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-lg shadow-yellow-500/20' 
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200'
                            }`}
                          >
                            <span className="text-base transform transition-transform hover:scale-125">🎉</span>
                            <span>Celebrate</span>
                            <span className="bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg text-xs font-semibold">
                              {notification.celebrateCount}
                            </span>
                          </button>
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-medium">View Post</span>
                          </button>
                        </>
                      )}
                      
                      {notification.type === 'post' && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg shadow-green-500/20"
                          style={{ backgroundColor: '#7DDE92' }}
                        >
                          <Eye className="w-4 h-4" />
                          <span>Open Post</span>
                          {notification.commentCount > 0 && (
                            <span className="flex items-center space-x-1.5 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-lg">
                              <MessageCircle className="w-3 h-3" />
                              <span className="text-xs font-semibold">{notification.commentCount}</span>
                            </span>
                          )}
                        </button>
                      )}
                      
                      {notification.type === 'comment' && (
                        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm font-medium">Open Thread</span>
                        </button>
                      )}
                      
                      {notification.type === 'friend_request' && (
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleFriendRequest(notification.id, 'accept')}
                            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg shadow-green-500/20"
                            style={{ backgroundColor: '#7DDE92' }}
                          >
                            <Check className="w-4 h-4" />
                            <span>Accept</span>
                          </button>
                          <button 
                            onClick={() => handleFriendRequest(notification.id, 'decline')}
                            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg shadow-red-500/20"
                            style={{ backgroundColor: '#F76E6E' }}
                          >
                            <X className="w-4 h-4" />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}
                      
                      {notification.type === 'announcement' && (
                        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">View Details</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredNotifications.length === 0 && (
          <div className="text-center py-16">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-blue-50 rounded-full animate-ping opacity-20"></div>
              <div className="relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500 max-w-sm mx-auto">You're all caught up! Check back later for new updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;