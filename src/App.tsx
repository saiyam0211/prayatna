import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/auth/index'
import LoginForm from './pages/auth/login'
import SignupForm from './pages/auth/signup'
import AuthLayout from './components/AuthLayout'
import './App.css'

function App() {
  return (
    <Router>
      <AuthLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </AuthLayout>
    </Router>
  )
}

export default App
