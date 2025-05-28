import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AuthPage from './pages/auth/index'
import LoginForm from './pages/auth/login'
import SignupForm from './pages/auth/signup'
import NotificationsPage from './pages/notification/index'
import AuthLayout from './components/AuthLayout'
import ExplorePage from './pages/explore/index'
import DashboardPage from './pages/dashboard/studentDashboard'
import './App.css'

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
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  )
}

export default App
