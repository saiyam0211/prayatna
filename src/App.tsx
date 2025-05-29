import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AuthPage from './pages/auth/index'
import LoginForm from './pages/auth/login'
import SignupForm from './pages/auth/signup'
import NotificationsPage from './pages/notification/index'
import AuthLayout from './components/AuthLayout'
import MainLayout from './components/MainLayout'
import ExplorePage from './pages/explore/index'
import DashboardPage from './pages/dashboard/studentDashboard'
import './App.css'
import ConnectionLayout from './pages/network/ConnectionLayout'
import NetworkPage from './pages/network/NetworkPage'
import ConnectionsPage from './pages/network/ConnectionsPage'
import PeopleIFollowPage from './pages/network/PeopleIFollowPage'
import EventsPage from './pages/network/EventsPage'
import PagesIFollow from './pages/network/PagesIFollow'

// Student Role Components
import StudentAuthPage from './pages/roles/student/auth/index'
import StudentLoginForm from './pages/roles/student/auth/login'
import StudentSignupForm from './pages/roles/student/auth/signup'

// Teacher Role Components
import TeacherAuthPage from './pages/roles/teacher/auth/index'
import TeacherLoginForm from './pages/roles/teacher/auth/login'
import TeacherDashboard from './pages/roles/teacher/dashboard/teacherDashboard'

// School Role Components
import SchoolAuthPage from './pages/roles/school/auth/index'
import SchoolSignupForm from './pages/roles/school/auth/signup'
import SchoolDashboard from './pages/roles/school/dashboard/schoolDashboard'

// Component to handle body attributes
function BodyAttributeHandler() {
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're on an auth page
    const isAuthPage = location.pathname.startsWith('/auth') || 
                      location.pathname === '/login' || 
                      location.pathname === '/signup';
    
    if (isAuthPage) {
      document.body.setAttribute('data-page', 'auth');
    } else {
      document.body.removeAttribute('data-page');
    }
    
    // Cleanup
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, [location]);
  
  return null;
}

function App() {
  return (
    <Router>
      <BodyAttributeHandler />
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthLayout><AuthPage /></AuthLayout>} />
        <Route path="/login" element={<AuthLayout><LoginForm /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignupForm /></AuthLayout>} />
        
        {/* Student Role Routes */}
        <Route path="/student/auth" element={<AuthLayout><StudentAuthPage /></AuthLayout>} />
        <Route path="/student/login" element={<AuthLayout><StudentLoginForm /></AuthLayout>} />
        <Route path="/student/signup" element={<AuthLayout><StudentSignupForm /></AuthLayout>} />
        
        {/* Teacher Role Routes */}
        <Route path="/teacher/auth" element={<AuthLayout><TeacherAuthPage /></AuthLayout>} />
        <Route path="/teacher/login" element={<AuthLayout><TeacherLoginForm /></AuthLayout>} />
        <Route path="/teacher/dashboard" element={<MainLayout><TeacherDashboard /></MainLayout>} />
        
        {/* School Role Routes */}
        <Route path="/school/auth" element={<AuthLayout><SchoolAuthPage /></AuthLayout>} />
        <Route path="/school/signup" element={<AuthLayout><SchoolSignupForm /></AuthLayout>} />
        <Route path="/school/dashboard" element={<MainLayout><SchoolDashboard /></MainLayout>} />
        
        {/* Protected routes with MainLayout */}
        <Route path="/notifications" element={<MainLayout><NotificationsPage /></MainLayout>} />
        <Route path="/explore" element={<MainLayout><ExplorePage /></MainLayout>} />
        <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />

        {/* Network routes with MainLayout */}
        <Route path="/network" element={<MainLayout><ConnectionLayout /></MainLayout>}>
          <Route index element={<NetworkPage />} />
          <Route path="connections" element={<ConnectionsPage />} />
          <Route path="people-i-follow" element={<PeopleIFollowPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="pages" element={<PagesIFollow />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
