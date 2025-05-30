import React, { useState } from "react";
import {
  User,
  School,
  Target,
  Heart,
  Award,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Play,
  FileText,
  Users,
  Trophy,
  Star,
  MapPin,
  Mail,
  Phone,
  Edit3,
  Camera,
  Activity,
  Brain,
  Zap,
  CheckCircle,
  XCircle,
  Minus,
  GraduationCap,
  MessageCircle,
  Share2,
  ThumbsUp,
  Eye,
  BookmarkIcon,
  MoreHorizontal,
  Globe,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Progress component for skill marks
const Progress = ({ value, className }: { value: number; className: string }) => (
  <div className={`bg-gray-200 rounded-full ${className}`}>
    <div
      className="bg-blue-500 h-full rounded-full transition-all duration-500"
      style={{ width: `${value}%` }}
    />
  </div>
);

// Icons for skill marks
const Calculator = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="16" y2="18" />
  </svg>
);

const Atom = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="1" />
    <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
    <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
  </svg>
);

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

<<<<<<< HEAD
  // Student Profile Data (load from localStorage if available)
  let profile = {
    name: "Satyabrata Mohanty",
    school: "PW Gururkul School",
=======
  // Student Profile Data
  const profile = {
    name: "Riya",
    school: "PW Gurukulam",
>>>>>>> refs/remotes/origin/main
    class: "Grade 12",
    hobbies: ["Reading", "Coding", "Basketball"],
    goals: ["Learn AI/ML", "Build Portfolio", "Join Tech Club"],
    avatar:
      "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg",
  };

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("prayatna_currentUser");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user && user.name) {
          profile.name = user.name;
        }
      } catch {}
    }
  }

  const studentProfile = {
    avatar: "🎯",
    class: "Science Stream",
    email: "alex.johnson@student.lincoln.edu",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "September 2023",
    streak: 45,
    profileScore: 85,
  };

  // Course and Skills Data
  const courseStats = {
    done: 75,
    onProgress: 20,
    toDo: 5,
  };

  const skillMarks = {
    mathematics: 92,
    science: 88,
    english: 85,
    physics: 90,
    chemistry: 86,
    biology: 91,
  };

  // New skill scores data for the redesigned component
  const scores = [
    {
      label: "Mathematics",
      score: 92,
      total: 100,
      icon: <Calculator className="h-5 w-5" />
    },
    {
      label: "Science", 
      score: 88,
      total: 100,
      icon: <Atom className="h-5 w-5" />
    },
    {
      label: "English",
      score: 85,
      total: 100,
      icon: <BookOpen className="h-5 w-5" />
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Math Olympiad Winner",
      date: "2024",
      icon: "🏆",
      type: "gold",
    },
    {
      id: 2,
      title: "Perfect Attendance",
      date: "2024",
      icon: "⭐",
      type: "silver",
    },
    {
      id: 3,
      title: "Science Fair Finalist",
      date: "2023",
      icon: "🔬",
      type: "bronze",
    },
    { id: 4, title: "Coding Champion", date: "2023", icon: "💻", type: "gold" },
    {
      id: 5,
      title: "Debate Team Captain",
      date: "2023",
      icon: "🎤",
      type: "silver",
    },
    {
      id: 6,
      title: "Basketball MVP",
      date: "2023",
      icon: "🏀",
      type: "bronze",
    },
  ];

  const activities = [
    { date: "10 Dec", score: 45, type: "high" },
    { date: "12 Dec", score: 32, type: "medium" },
    { date: "14 Dec", score: 58, type: "high" },
    { date: "16 Dec", score: 28, type: "low" },
    { date: "18 Dec", score: 42, type: "medium" },
    { date: "20 Dec", score: 65, type: "high" },
    { date: "22 Dec", score: 38, type: "medium" },
  ];

  const weakestTopics = [
    { id: 1, topic: "Food safety", score: 75 },
    { id: 2, topic: "Compliance basics", score: 52 },
    { id: 3, topic: "Company networking", score: 36 },
  ];

  const strongestTopics = [
    { id: 1, topic: "Cyber security basics", score: 92 },
    { id: 2, topic: "Covid protocols", score: 96 },
    { id: 3, topic: "Social media policies", score: 89 },
  ];

  const courseSchedule = [
    { date: "12", day: "Dec", isActive: false },
    { date: "14", day: "Dec", isActive: false },
    { date: "16", day: "Dec", isActive: true },
    { date: "18", day: "Dec", isActive: false },
  ];

  const summary = {
    totalCourses: 24,
    totalTime: 180,
    completedAssignments: 180,
  };

  const recentPosts = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "🤓",
      content:
        "Just completed my machine learning project! Built a recommendation system for our school library. Excited to present it next week! 🚀",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      shares: 3,
      type: "achievement",
    },
    {
      id: 2,
      user: "Mike Chen",
      avatar: "💻",
      content:
        "Study group for AP Physics this weekend! We'll be covering momentum and energy. Room 204, Saturday 2 PM. Bring your calculators! 📚",
      timestamp: "4 hours ago",
      likes: 18,
      comments: 12,
      shares: 6,
      type: "study",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Main Content */}
        <div className="p-4 mx-auto px-2 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar - Enhanced Profile Card */}
            <div className="lg:col-span-3">
              <div className="sticky top-6 space-y-6">
                {/* Enhanced Profile Card */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500">
                  
                  {/* Cover Background */}
                  <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-4 right-4">
                      <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110">
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Profile Info */}
                  <div className="px-8 pb-8 h-[50rem]">
                    <div className="flex flex-col items-center -mt-16">
                      <div className="relative">
                        <Avatar className="w-28 h-28 ring-4 ring-white shadow-2xl">
                          <AvatarImage src={profile.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-2xl font-bold">
                            {profile.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      
                      <h3 className="mt-6 font-bold text-2xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-center">
                        {profile.name}
                      </h3>
                      <p className="text-gray-500 font-medium mt-1">{profile.class}</p>
                      <div className="mt-2 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Active Student
                      </div>
                    </div>

                    <div className="space-y-6 mt-8">
                      
                      {/* School Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                          <School className="w-5 h-5 mr-3 text-blue-600" />
                          School
                        </h4>
                        <p className="text-gray-700 font-medium">{profile.school}</p>
                      </div>

                      {/* Hobbies Section */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                        <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                          <Heart className="w-5 h-5 mr-3 text-pink-600" />
                          Hobbies & Interests
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.hobbies.map((hobby) => (
                            <span
                              key={hobby}
                              className="px-4 py-2 bg-white text-purple-700 rounded-full border-2 border-purple-200 font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                            >
                              {hobby}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Goals Section */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
                        <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                          <Target className="w-5 h-5 mr-3 text-green-600" />
                          Current Goals
                        </h4>
                        <ul className="space-y-3">
                          {profile.goals.map((goal, index) => (
                            <li
                              key={goal}
                              className="flex items-center gap-4 text-gray-700 font-medium"
                            >
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">{index + 1}</span>
                              </div>
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-7">
              <div className="space-y-4">
                
                {/* First Row - Skill Marks & Streak Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Enhanced Skill Marks */}
                  <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        Skill Marks
                      </h2>
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110"
                          title="Refresh validation"
                          aria-label="Refresh validation"
                        >
                          <RefreshCw className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {scores.map((item, index) => (
                        <div key={item.label} className="group">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                                index === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' :
                                index === 1 ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' :
                                'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                              }`}>
                                {item.icon}
                              </div>
                              <div>
                                <span className="text-gray-800 font-bold text-base">{item.label}</span>
                                <div className="text-xs text-gray-500 font-medium">Subject Performance</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-baseline gap-1">
                                <span className="font-black text-2xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{item.score}</span>
                                <span className="text-gray-400 font-medium">/{item.total}</span>
                              </div>
                              <div className="text-xs text-gray-500 font-medium">Score</div>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                  index === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                                  index === 1 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                  'bg-gradient-to-r from-purple-500 to-pink-500'
                                }`}
                                style={{ width: `${(item.score / item.total) * 100}%` }}
                              />
                            </div>
                            <div className="absolute -top-1 right-0 transform translate-x-1/2">
                              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                                index === 0 ? 'bg-blue-500' :
                                index === 1 ? 'bg-green-500' :
                                'bg-purple-500'
                              }`}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Streak Section */}
                  <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        Streak
                      </h3>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center py-4">
                      {/* Enhanced Fire Emoji with glow and zoom */}
                      <div className="relative mb-4">
                        <div className="text-6xl fire-glow">🔥</div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                          <span className="text-white text-xs font-bold">
                            HOT
                          </span>
                        </div>
                      </div>
                      
                      {/* Streak Number */}
                      <div className="text-center mb-4">
                        <div className="text-5xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
                          {studentProfile.streak}
                        </div>
                        <div className="text-lg font-bold text-gray-700 mb-1">
                          Day Streak
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                          Keep it going! 🚀
                        </div>
                      </div>
                      
                      {/* Streak Animation Effect */}
                      <div className="flex space-x-2">
                        {[...Array(7)].map((_, index) => (
                          <div 
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              index < 7
                                ? "bg-gradient-to-r from-orange-400 to-red-500 animate-pulse shadow-lg"
                                : "bg-gray-200"
                            }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row - Activities & Posts (Full Width) */}
                <div className="bg-white rounded-3xl shadow-xl p-8 py-6 border border-gray-100 hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      Activities & Posts
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Activities Chart */}
                    <div>
                      <div className="h-48 flex items-end justify-between space-x-3">
                        {activities.map((activity, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center space-y-2 flex-1"
                          >
                            <div
                              className="w-full rounded-t-xl transition-all hover:opacity-80 max-w-12 hover:scale-105 shadow-lg"
                              style={{
                                height: `${(activity.score / 70) * 100}%`,
                                background: index === 4 
                                  ? 'linear-gradient(to top, #4BA3C7, #7DD3FC)' 
                                  : 'linear-gradient(to top, #E5E7EB, #F3F4F6)',
                                minHeight: "32px",
                              }}
                            ></div>
                            <span className="text-xs text-gray-500 transform rotate-45 font-medium">
                              {activity.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Posts */}
                    <div>
                      <div className="space-y-4">
                        {recentPosts.map((post) => (
                          <div
                            key={post.id}
                            className="p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:shadow-lg"
                          >
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xl shadow-md">
                                {post.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-bold text-gray-800">
                                    {post.user}
                                  </span>
                                  <span className="text-xs text-gray-500 font-medium">
                                    {post.timestamp}
                                  </span>
                                </div>
                                <p className="text-gray-700 mb-4 line-clamp-3 text-left font-medium leading-relaxed">
                                  {post.content}
                                </p>
                                <div className="flex items-center space-x-6 text-sm text-gray-500">
                                  <span className="flex items-center space-x-2 hover:text-red-500 cursor-pointer transition-colors font-medium">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>{post.likes}</span>
                                  </span>
                                  <span className="flex items-center space-x-2 hover:text-blue-500 cursor-pointer transition-colors font-medium">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{post.comments}</span>
                                  </span>
                                  <span className="flex items-center space-x-2 hover:text-green-500 cursor-pointer transition-colors font-medium">
                                    <Share2 className="w-4 h-4" />
                                    <span>{post.shares}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Third Row - My Achievements */}
                <div className="bg-white rounded-3xl shadow-xl p-8 w-64 h-[54rem]  border border-gray-100 hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-center justify-center mb-8">
                    <h3 className="text-xl font-bold text-gray-800 flex flex-col items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-3">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      My Achievements
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-6">
                    {achievements.slice(0, 3).map((achievement) => (
                      <div 
                        key={achievement.id} 
                        className={`h-48 w-full p-5 rounded-2xl border-2 text-center hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 duration-300 ${
                          achievement.type === "gold"
                            ? "border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-100 hover:from-yellow-100 hover:to-orange-200"
                            : achievement.type === "silver"
                            ? "border-gray-300 bg-gradient-to-br from-gray-50 to-slate-100 hover:from-gray-100 hover:to-slate-200"
                            : "border-orange-300 bg-gradient-to-br from-orange-50 to-red-100 hover:from-orange-100 hover:to-red-200"
                        }`}
                      >
                        <div className="text-4xl mb-3">{achievement.icon}</div>
                        <h4 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 leading-tight">
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-gray-600 font-medium">
                          {achievement.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
          </div>
        </div>
      </div>

      <style>{`
        .fire-glow {
          animation: fireGlow 2s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 15px rgba(255, 165, 0, 0.7));
        }
        
        @keyframes fireGlow {
          0% {
            transform: scale(1);
            filter: drop-shadow(0 0 15px rgba(255, 165, 0, 0.7));
          }
          100% {
            transform: scale(1.08);
            filter: drop-shadow(0 0 25px rgba(255, 69, 0, 0.9));
          }
        }
      `}</style>
    </>
  );
};

export default StudentDashboard;
