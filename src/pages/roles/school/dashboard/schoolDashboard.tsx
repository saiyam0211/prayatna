import React, { useState, useEffect } from "react";
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
  UserPlus,
  UserCheck,
  Flag,
  AlertTriangle,
  Filter,
  Download,
  Upload,
  Building,
  Calendar as CalendarIcon,
  X,
  Shield,
  Bookmark,
  Hash,
  Image,
  Video,
  Link,
  MoreVertical,
  Loader2,
  Trash2,
  Check,
  AlertCircle,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Activity as ActivityIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import { useAuth } from "@/lib/auth";

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

// Progress component for stats
const Progress = ({
  value,
  className,
}: {
  value: number;
  className: string;
}) => (
  <div className={`bg-gray-200 rounded-full ${className}`}>
    <div
      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
      style={{ width: `${value}%` }}
    />
  </div>
);

const SchoolDashboard = () => {
  const { school } = useAuth();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states for modals
  const [studentForm, setStudentForm] = useState({
    enrollmentId: '',
    phoneNumber: ''
  });
  
  const [teacherForm, setTeacherForm] = useState({
    email: '',
    password: '',
    name: '',
    department: '',
    experience: 0
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [schoolPosts, setSchoolPosts] = useState([]);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await school.getDashboard();
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await school.getStudents();
      setStudents(response.data.students || []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await school.getTeachers();
      setTeachers(response.data.teachers || []);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    
    try {
      setSubmitting(true);
      await school.createStudent(studentForm);
      
      // Reset form and close modal
      setStudentForm({ enrollmentId: '', phoneNumber: '' });
      setActiveModal(null);
      
      // Refresh dashboard data
      await fetchDashboardData();
      
      alert('Student record created successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    
    try {
      setSubmitting(true);
      await school.createTeacher(teacherForm);
      
      // Reset form and close modal
      setTeacherForm({
        email: '',
        password: '',
        name: '',
        department: '',
        experience: 0
      });
      setActiveModal(null);
      
      // Refresh dashboard data
      await fetchDashboardData();
      
      alert('Teacher account created successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create teacher');
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = async (modalType: string) => {
    setActiveModal(modalType);
    
    // Fetch data based on modal type
    if (modalType === 'students') {
      await fetchStudents();
    } else if (modalType === 'teachers') {
      await fetchTeachers();
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    // Reset forms when closing modals
    setStudentForm({ enrollmentId: '', phoneNumber: '' });
    setTeacherForm({
      email: '',
      password: '',
      name: '',
      department: '',
      experience: 0
    });
  };

  const handleApprovePost = async (postId: string) => {
    try {
      // API call to approve flagged post
      console.log('Approving post:', postId);
      // Remove from flagged posts after approval
      setFlaggedPosts(prev => prev.filter((post: any) => post._id !== postId));
    } catch (err) {
      console.error('Failed to approve post:', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      // API call to delete post
      console.log('Deleting post:', postId);
      // Remove from posts list after deletion
      setFlaggedPosts(prev => prev.filter((post: any) => post._id !== postId));
      setRecentPosts(prev => prev.filter((post: any) => post._id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4 mx-auto" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardData} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { profile, stats, recentPosts: dashboardRecentPosts, flaggedPosts: dashboardFlaggedPosts, schoolPosts: dashboardSchoolPosts } = dashboardData || {};

  return (
    <>
      {/* Enhanced Background with Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2px, transparent 0),
                           radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2px, transparent 0)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>
      
      {/* Main Dashboard - Fixed Height Container */}
      <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
        {/* Main Content */}
        <div className="h-full p-6">
          <div className="grid grid-cols-12 gap-6 h-full">
            
            {/* Left Sidebar - School Profile */}
            <div className="col-span-3 h-[50rem]">
              <div className="h-full flex flex-col space-y-4">
                {/* School Profile Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 flex-1 overflow-hidden">
                  {/* Cover Background */}
                  <div className="h-20 relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="absolute inset-0 bg-white bg-opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    {/* Decorative Pattern */}
                    <div className="absolute top-2 right-4">
                      <School className="w-6 h-6 text-white/30" />
                    </div>
                    {/* Additional decorative elements */}
                    <div className="absolute top-4 left-4 flex space-x-1">
                      <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                      <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                      <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                    </div>
                  </div>

                  {/* School Info - Scrollable Content */}
                  <div className="px-6 pb-6 h-[calc(100%-5rem)] overflow-y-auto">
                    <div className="flex flex-col items-center -mt-10">
                      <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-full bg-white p-1 shadow-xl">
                          <Avatar className="w-full h-full">
                            <AvatarImage src={profile?.logo} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-xl font-bold">
                              <School className="w-8 h-8 text-blue-600" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>

                      <div className="text-center mb-6">
                        <h3 className="font-bold text-lg bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight mb-1">
                          {profile?.name || 'School Name'}
                        </h3>
                        <p className="text-gray-500 font-medium text-sm">
                          Est. {profile?.establishedYear || '2023'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Location */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100 hover:shadow-md transition-all">
                        <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <MapPin className="w-4 h-4 text-blue-600" />
                          </div>
                          Location
                        </h4>
                        <p className="text-gray-700 text-sm font-medium leading-relaxed ml-11">
                          {profile?.address || 'Address not provided'}
                        </p>
                        <p className="text-gray-600 text-sm ml-11">
                          {profile?.city}, {profile?.state} - {profile?.pincode}
                        </p>
                      </div>

                      {/* Contact */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100 hover:shadow-md transition-all">
                        <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <Phone className="w-4 h-4 text-green-600" />
                          </div>
                          Contact
                        </h4>
                        <div className="space-y-1 ml-11">
                          <p className="text-gray-700 text-sm font-medium flex items-center">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            {profile?.phone || 'Not provided'}
                          </p>
                          <p className="text-gray-700 text-sm font-medium flex items-center">
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            {profile?.email || 'Not provided'}
                          </p>
                        </div>
                      </div>

                      {/* Academic Info */}
                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 border border-orange-100 hover:shadow-md transition-all">
                        <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <GraduationCap className="w-4 h-4 text-orange-600" />
                          </div>
                          Academic Info
                        </h4>
                        <div className="space-y-1 ml-11">
                          <p className="text-gray-700 text-sm font-medium">
                            <span className="text-gray-500">Principal:</span> {profile?.principalName || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Create Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={() => openModal('createStudent')}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl h-12 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Create Student Record
                  </Button>
                  
                  <Button 
                    onClick={() => openModal('createTeacher')}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl h-12 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Create Teacher Account
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-6 h-full">
              <div className="h-full overflow-y-auto space-y-6 pr-3">
                
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Students Card */}
                  <div 
                    onClick={() => openModal('students')}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Students</p>
                        <p className="text-3xl font-bold text-blue-600 group-hover:scale-105 transition-transform">
                          {stats?.totalStudents || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Teachers Card */}
                  <div 
                    onClick={() => openModal('teachers')}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Teachers</p>
                        <p className="text-3xl font-bold text-green-600 group-hover:scale-105 transition-transform">
                          {stats?.totalTeachers || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Analytics */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-3 text-purple-600" />
                    School Analytics
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <UsersIcon className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats?.totalUsers || 0}</p>
                      <p className="text-sm text-gray-500">Total Users</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ActivityIcon className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats?.activeUsers || 0}</p>
                      <p className="text-sm text-gray-500">Active Users</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrendingUpIcon className="w-8 h-8 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats?.engagementRate || '0%'}</p>
                      <p className="text-sm text-gray-500">Engagement Rate</p>
                    </div>
                  </div>
                </div>

                {/* Flagged Posts */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <Flag className="w-5 h-5 mr-3 text-red-600" />
                    Flagged Posts
                    <Badge className="ml-auto bg-red-100 text-red-800">
                      {dashboardFlaggedPosts?.length || 0}
                    </Badge>
                  </h3>
                  
                  {dashboardFlaggedPosts?.length > 0 ? (
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {dashboardFlaggedPosts.map((post: any) => (
                        <div key={post._id} className="border border-red-200 rounded-xl p-4 bg-red-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{post.author?.name}</p>
                              <p className="text-sm text-gray-600 mt-1">{post.content?.substring(0, 100)}...</p>
                              <p className="text-xs text-gray-500 mt-2">Flagged: {post.flagReason}</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                onClick={() => handleApprovePost(post._id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeletePost(post._id)}
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No flagged posts at the moment</p>
                    </div>
                  )}
                </div>

                {/* Recent Posts */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-3 text-blue-600" />
                    Recent Student Posts
                  </h3>
                  
                  {dashboardRecentPosts?.length > 0 ? (
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {dashboardRecentPosts.map((post: any) => (
                        <div key={post._id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={post.author?.avatar} />
                                  <AvatarFallback>{post.author?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-800">{post.author?.name}</p>
                                  <p className="text-xs text-gray-500">{post.createdAt}</p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{post.content}</p>
                              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {post.likes?.length || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  {post.comments?.length || 0}
                                </span>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleDeletePost(post._id)}
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No recent posts from students</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="col-span-3 h-full">
              <div className="h-full overflow-y-auto space-y-6">
                
                {/* School Activity */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <Building className="w-5 h-5 mr-3 text-indigo-600" />
                    School Activity
                  </h3>
                  
                  {dashboardSchoolPosts?.length > 0 ? (
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {dashboardSchoolPosts.map((post: any) => (
                        <div key={post._id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={`
                              ${post.category === 'Notice' ? 'bg-blue-100 text-blue-800' : ''}
                              ${post.category === 'Announcement' ? 'bg-green-100 text-green-800' : ''}
                              ${post.category === 'Event' ? 'bg-purple-100 text-purple-800' : ''}
                              ${post.category === 'Alert' ? 'bg-red-100 text-red-800' : ''}
                            `}>
                              {post.category || 'General'}
                            </Badge>
                            <span className="text-xs text-gray-500">{post.createdAt}</span>
                          </div>
                          <p className="text-sm text-gray-800 font-medium mb-2">{post.title}</p>
                          <p className="text-sm text-gray-600">{post.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No school activities yet</p>
                    </div>
                  )}
                </div>

                {/* AI Insights - Placeholder */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <Brain className="w-5 h-5 mr-3 text-pink-600" />
                    AI Insights
                    <Badge className="ml-auto bg-pink-100 text-pink-800">
                      Coming Soon
                    </Badge>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-pink-600" />
                        <span className="font-medium text-gray-800">Student Engagement</span>
                      </div>
                      <p className="text-sm text-gray-600">AI-powered insights about student participation and engagement patterns.</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-800">Performance Analytics</span>
                      </div>
                      <p className="text-sm text-gray-600">Detailed analysis of academic performance trends and recommendations.</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-800">Goal Tracking</span>
                      </div>
                      <p className="text-sm text-gray-600">Monitor student goals and provide personalized guidance for achievement.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      
      {/* Create Student Modal */}
      <Modal isOpen={activeModal === 'createStudent'} onClose={closeModal} title="Create Student Record">
        <form onSubmit={handleCreateStudent} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enrollment ID
            </label>
            <input
              type="text"
              value={studentForm.enrollmentId}
              onChange={(e) => setStudentForm(prev => ({ ...prev, enrollmentId: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={studentForm.phoneNumber}
              onChange={(e) => setStudentForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={closeModal}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Student'
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Teacher Modal */}
      <Modal isOpen={activeModal === 'createTeacher'} onClose={closeModal} title="Create Teacher Account">
        <form onSubmit={handleCreateTeacher} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={teacherForm.email}
                onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={teacherForm.password}
                onChange={(e) => setTeacherForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={teacherForm.name}
              onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                value={teacherForm.department}
                onChange={(e) => setTeacherForm(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (Years)
              </label>
              <input
                type="number"
                value={teacherForm.experience}
                onChange={(e) => setTeacherForm(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={closeModal}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Teacher'
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Students List Modal */}
      <Modal isOpen={activeModal === 'students'} onClose={closeModal} title="Students">
        <div className="space-y-4">
          {students.length > 0 ? (
            <div className="max-h-96 overflow-y-auto space-y-3">
              {students.map((student: any) => (
                <div key={student._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name?.charAt(0) || 'S'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{student.name || 'Student'}</p>
                      <p className="text-sm text-gray-500">ID: {student.enrollmentId}</p>
                      <p className="text-sm text-gray-500">{student.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={student.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No students found</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Teachers List Modal */}
      <Modal isOpen={activeModal === 'teachers'} onClose={closeModal} title="Teachers">
        <div className="space-y-4">
          {teachers.length > 0 ? (
            <div className="max-h-96 overflow-y-auto space-y-3">
              {teachers.map((teacher: any) => (
                <div key={teacher._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={teacher.avatar} />
                      <AvatarFallback>{teacher.name?.charAt(0) || 'T'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{teacher.name}</p>
                      <p className="text-sm text-gray-500">{teacher.department}</p>
                      <p className="text-sm text-gray-500">{teacher.experience} years experience</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={teacher.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {teacher.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No teachers found</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SchoolDashboard; 