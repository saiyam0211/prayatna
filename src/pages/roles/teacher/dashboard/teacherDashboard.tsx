import React, { useState } from "react";
import {
  User,
  School,
  Heart,
  Award,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  MessageCircle,
  Share2,
  ThumbsUp,
  Eye,
  Plus,
  MapPin,
  Mail,
  Phone,
  Edit3,
  Activity,
  Brain,
  Zap,
  CheckCircle,
  GraduationCap,
  Users,
  Trophy,
  Star,
  Target,
  FileText,
  Video,
  Image,
  X,
  CalendarPlus,
  CalendarCheck,
  Briefcase,
  Building,
  BookMarked,
  UserCheck,
  Sparkles,
  Crown,
  Medal,
  Gift,
  Flame,
  ChevronRight,
  MoreHorizontal,
  Hash,
  Globe,
  Bell,
  Settings,
  ClipboardList,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";

// Modal Component
const Modal = ({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-xl transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Teacher Profile Data
  const teacherProfile = {
    name: "Dr. Priya Sharma",
    avatar: "👩‍🏫",
    school: "Gurukulam International School",
    subject: "Mathematics",
    department: "Science & Mathematics",
    experience: "8 years",
    email: "priya.sharma@gurukulam.edu.in",
    phone: "+91 98765 43210",
    employeeId: "TCH2024001",
    qualification: "M.Sc. Mathematics, B.Ed.",
    classes: ["9th", "10th", "11th", "12th"],
    followers: 234,
    posts: 45,
    students: 156,
  };

  // Activity Data
  const activityData = [
    {
      id: 1,
      type: "assignment",
      title: "Created new assignment",
      description: "Quadratic Equations - Chapter 4",
      timestamp: "2 hours ago",
      icon: FileText,
      color: "blue"
    },
    {
      id: 2,
      type: "announcement",
      title: "Posted announcement",
      description: "Tomorrow's class will be in Lab 2",
      timestamp: "4 hours ago",
      icon: Bell,
      color: "green"
    },
    {
      id: 3,
      type: "achievement",
      title: "Student achievement",
      description: "Arjun scored 98% in monthly test",
      timestamp: "1 day ago",
      icon: Trophy,
      color: "yellow"
    },
    {
      id: 4,
      type: "submission",
      title: "Assignments submitted",
      description: "12 students submitted Geometry homework",
      timestamp: "6 hours ago",
      icon: BookOpen,
      color: "purple"
    },
    {
      id: 5,
      type: "grade",
      title: "Graded assignments",
      description: "Completed grading for Algebra Quiz 3",
      timestamp: "8 hours ago",
      icon: CheckCircle,
      color: "emerald"
    },
  ];

  // Events Data
  const events = [
    {
      id: 1,
      title: "Parent-Teacher Meeting",
      date: "2024-02-15",
      time: "10:00 AM",
      type: "meeting",
      status: "upcoming",
      description: "Quarterly progress discussion with parents",
      attendees: 25,
    },
    {
      id: 2,
      title: "Science Exhibition",
      date: "2024-02-20",
      time: "9:00 AM",
      type: "event",
      status: "upcoming",
      description: "Annual science project showcase",
      attendees: 150,
    },
    {
      id: 3,
      title: "Math Olympiad Training",
      date: "2024-02-12",
      time: "2:00 PM",
      type: "training",
      status: "completed",
      description: "Advanced problem solving session",
      attendees: 12,
    },
  ];

  // Achievements Data
  const achievements = [
    {
      id: 1,
      title: "Best Teacher Award",
      description: "Excellence in Mathematics Teaching 2023",
      icon: Trophy,
      color: "yellow",
      date: "2023-12-15",
      badge: "🏆"
    },
    {
      id: 2,
      title: "Student Success Rate",
      description: "95% students scored above 90%",
      icon: Target,
      color: "green",
      date: "2023-11-30",
      badge: "🎯"
    },
    {
      id: 3,
      title: "Innovation in Teaching",
      description: "Implemented AI-powered learning tools",
      icon: Brain,
      color: "purple",
      date: "2023-10-20",
      badge: "🧠"
    },
  ];

  // Recent Posts
  const recentPosts = [
    {
      id: 1,
      author: "You",
      content: "Great work on today's trigonometry problems! Keep practicing and you'll master it soon. 📐✨",
      timestamp: "3 hours ago",
      likes: 28,
      comments: 12,
      shares: 5,
      type: "announcement"
    },
    {
      id: 2,
      author: "Student - Arjun Kumar",
      content: "Thank you ma'am for the extra help session. Finally understood quadratic equations! 🎉",
      timestamp: "5 hours ago",
      likes: 45,
      comments: 18,
      shares: 8,
      type: "appreciation"
    },
  ];

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      {/* Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2px, transparent 0),
                           radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2px, transparent 0)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Main Dashboard */}
      <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
        <div className="h-full p-6">
          <div className="grid grid-cols-12 gap-6 h-full">
            
            {/* Left Sidebar - Teacher Profile */}
            <div className="col-span-3 h-[50rem]">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 h-full overflow-hidden">

                {/* Teacher Info - Scrollable Content */}
                <div className="px-6 pb-6 h-[calc(100%-0rem)] pt-6 overflow-y-auto mt-10">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full bg-white p-1 shadow-xl">
                        <Avatar className="w-full h-full">
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-2xl font-bold">
                            {teacherProfile.avatar}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <h3 className="font-bold text-lg bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight mb-1">
                        {teacherProfile.name}
                      </h3>
                      <p className="text-gray-500 font-medium text-sm">
                        {teacherProfile.subject} Teacher
                      </p>
                      <div className="mt-3 inline-flex px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Active Teacher
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* School Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100 hover:shadow-md transition-all">
                      <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Building className="w-4 h-4 text-blue-600" />
                        </div>
                        School
                      </h4>
                      <p className="text-gray-700 text-sm font-medium ml-11">
                        {teacherProfile.school}
                      </p>
                    </div>

                    {/* Subject & Department */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100 hover:shadow-md transition-all">
                      <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <BookMarked className="w-4 h-4 text-purple-600" />
                        </div>
                        Subject & Department
                      </h4>
                      <div className="space-y-1 ml-11">
                        <p className="text-gray-700 text-sm font-medium">
                          <span className="text-gray-500">Department:</span> {teacherProfile.department}
                        </p>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100 hover:shadow-md transition-all">
                      <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <Briefcase className="w-4 h-4 text-green-600" />
                        </div>
                        Experience
                      </h4>
                      <p className="text-gray-700 text-sm font-medium ml-11">
                        {teacherProfile.experience} of teaching
                      </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-4 border border-indigo-100">
                      <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                          <Target className="w-4 h-4 text-indigo-600" />
                        </div>
                        Quick Stats
                      </h4>
                      <div className="grid grid-cols-3 gap-2 ml-11">
                        <div className="text-center p-2 bg-white rounded-lg border border-indigo-100 hover:shadow-sm transition-all">
                          <p className="text-sm font-bold text-indigo-600">{teacherProfile.students}</p>
                          <p className="text-xs text-gray-500">Students</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg border border-indigo-100 hover:shadow-sm transition-all">
                          <p className="text-sm font-bold text-purple-600">{teacherProfile.posts}</p>
                          <p className="text-xs text-gray-500">Posts</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg border border-indigo-100 hover:shadow-sm transition-all">
                          <p className="text-sm font-bold text-green-600">{teacherProfile.followers}</p>
                          <p className="text-xs text-gray-500">Followers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-6 h-full">
              <div className="h-full overflow-y-auto space-y-6 pr-3">
                
                {/* Activity Feed */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/30 h-[50rem]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-4 shadow-md">
                        <Activity className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Activity</span>
                        <p className="text-sm text-gray-500 font-normal">Recent actions & updates</p>
                      </div>
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {activityData.map((activity) => {
                      const IconComponent = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                          <div className={`w-12 h-12 bg-gradient-to-br from-${activity.color}-100 to-${activity.color}-200 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                            <IconComponent className={`w-6 h-6 text-${activity.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-base mb-1 group-hover:text-gray-900 transition-colors">{activity.title}</h3>
                            <p className="text-gray-600 text-sm mb-2 leading-relaxed">{activity.description}</p>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-500">{activity.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Events */}
            <div className="col-span-3 h-full">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/30 h-full overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mr-3 shadow-md">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Events</span>
                      <p className="text-xs text-gray-500 font-normal">Manage your schedule</p>
                    </div>
                  </h2>
                  <Button 
                    onClick={() => openModal('createEvent')}
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                <div className="space-y-4 h-[calc(100%-5rem)] overflow-y-auto pr-2">
                  {events.map((event) => (
                    <div key={event.id} className={`p-4 rounded-2xl border hover:shadow-lg transition-all duration-300 group cursor-pointer ${
                      event.status === 'upcoming' 
                        ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:from-blue-100 hover:to-cyan-100' 
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-150'
                    }`}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform shadow-md ${
                          event.status === 'upcoming' ? 'bg-gradient-to-br from-blue-100 to-blue-200' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                        }`}>
                          {event.type === 'meeting' ? 
                            <Users className={`w-5 h-5 ${event.status === 'upcoming' ? 'text-blue-600' : 'text-gray-600'}`} /> : 
                            event.type === 'event' ?
                            <Calendar className={`w-5 h-5 ${event.status === 'upcoming' ? 'text-blue-600' : 'text-gray-600'}`} /> :
                            <BookOpen className={`w-5 h-5 ${event.status === 'upcoming' ? 'text-blue-600' : 'text-gray-600'}`} />
                          }
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-sm leading-tight mb-2 group-hover:text-gray-900 transition-colors">{event.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={`text-xs ${
                              event.status === 'upcoming' 
                                ? 'border-blue-300 text-blue-700 bg-blue-50' 
                                : 'border-gray-300 text-gray-700 bg-gray-50'
                            }`}>
                              {event.type}
                            </Badge>
                            <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'} className="text-xs">
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">{event.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {event.date}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {event.time}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {event.attendees} attendees
                          </p>
                          {event.status === 'upcoming' && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 font-medium">Active</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Quick Event Summary */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                    <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 text-purple-600 mr-2" />
                      This Week
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Upcoming Events</span>
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          {events.filter(e => e.status === 'upcoming').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Total Attendees</span>
                        <span className="text-xs font-bold text-purple-600">
                          {events.filter(e => e.status === 'upcoming').reduce((acc, e) => acc + e.attendees, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={activeModal === 'createEvent'}
        onClose={closeModal}
        title="Create New Event"
      >
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <CalendarPlus className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-600 text-sm">Add a new event to your teaching schedule</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gradient-to-r from-white to-green-50/30 transition-all"
                placeholder="Enter event title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type</label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gradient-to-r from-white to-green-50/30 transition-all">
                <option>Select type</option>
                <option>Meeting</option>
                <option>Event</option>
                <option>Training</option>
                <option>Workshop</option>
                <option>Parent Conference</option>
                <option>Examination</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input 
                type="date" 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gradient-to-r from-white to-green-50/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
              <input 
                type="time" 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gradient-to-r from-white to-green-50/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea 
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gradient-to-r from-white to-green-50/30 transition-all resize-none"
              placeholder="Enter event description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Attendees</label>
              <input 
                type="number" 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gradient-to-r from-white to-green-50/30 transition-all"
                placeholder="Number of attendees"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gradient-to-r from-white to-green-50/30 transition-all"
                placeholder="Event location"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 py-3">
              <CalendarPlus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
            <Button variant="outline" onClick={closeModal} className="flex-1 border-2 border-gray-300 hover:bg-gray-50 rounded-xl py-3 hover:border-gray-400 transition-all">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TeacherDashboard; 