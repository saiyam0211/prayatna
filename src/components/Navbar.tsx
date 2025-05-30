import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  Users, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Search,
  Menu,
  X,
  BookOpen,
  Zap
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  count?: number;
}

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: <Home size={20} />,
      path: '/dashboard',
    },
    {
      label: 'Explore',
      icon: <Compass size={20} />,
      path: '/explore',
    },
    {
      label: 'Network',
      icon: <Users size={20} />,
      path: '/network',
    },
    {
      label: 'Notifications',
      icon: <Bell size={20} />,
      path: '/notifications',
      count: 3,
    },
  ];

  const profileItems = [
    { label: 'Profile', icon: <User size={16} />, path: '/profile' },
    { label: 'Settings', icon: <Settings size={16} />, path: '/settings' },
    { label: 'Logout', icon: <LogOut size={16} />, path: '/auth' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleProfileAction = (path: string, label: string) => {
    if (label === 'Logout') {
      // Handle logout logic here
      localStorage.removeItem('token');
      navigate('/auth');
    } else {
      navigate(path);
    }
    setIsProfileOpen(false);
  };

  const currentUser = {
    name: 'Riya',
    email: 'satya@student.prayatna.edu',
    avatar: '🎓',
    role: 'Student'
  };

  return (
    <nav className={`bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${className}`}>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="/logo.png" 
                alt="Prayatna Logo" 
                className="w-10 h-10 rounded-xl"
              />
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50/50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#4BA3C7]/20 focus:border-[#4BA3C7] transition-all duration-200"
                placeholder="Search students, teachers, posts..."
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                             (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#4BA3C7]/10 to-[#A484F3]/10 text-[#4BA3C7] border-2 border-[#4BA3C7]/20'
                      : 'text-gray-600 hover:text-[#4BA3C7] hover:bg-[#F2F5F7] border-2 border-transparent'
                  }`}
                >
                  <div className={`transition-colors ${isActive ? 'text-[#4BA3C7]' : 'group-hover:text-[#4BA3C7]'}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.label}</span>
                  {item.count && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[#F2F5F7] transition-all duration-200 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#4BA3C7] to-[#A484F3] rounded-xl flex items-center justify-center text-white text-sm font-bold group-hover:scale-105 transition-transform">
                {currentUser.avatar}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                <div className="text-xs text-gray-500">{currentUser.role}</div>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white border border-gray-100 z-20 overflow-hidden">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-[#4BA3C7] to-[#A484F3] p-4 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg font-bold">
                        {currentUser.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{currentUser.name}</div>
                        <div className="text-sm opacity-90">{currentUser.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Profile Menu Items */}
                  <div className="py-2">
                    {profileItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleProfileAction(item.path, item.label)}
                        className={`w-full flex items-center px-4 py-3 text-sm transition-all duration-200 hover:bg-[#F2F5F7] ${
                          item.label === 'Logout' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                        }`}
                      >
                        <div className="mr-3">{item.icon}</div>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-[#4BA3C7] hover:bg-[#F2F5F7] transition-all duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50/50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#4BA3C7]/20 focus:border-[#4BA3C7] transition-all duration-200"
                  placeholder="Search..."
                />
              </div>
              
              {/* Mobile Navigation Items */}
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                               (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.path)}
                    className={`relative w-full flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#4BA3C7]/10 to-[#A484F3]/10 text-[#4BA3C7] border-2 border-[#4BA3C7]/20'
                        : 'text-gray-600 hover:text-[#4BA3C7] hover:bg-[#F2F5F7] border-2 border-transparent'
                    }`}
                  >
                    <div className="mr-3">{item.icon}</div>
                    <span>{item.label}</span>
                    {item.count && (
                      <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 