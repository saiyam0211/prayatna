import { useState } from 'react'

interface UserData {
  fullName: string
  gender?: "male" | "female" | "other" | ""
  dateOfBirth?: Date
  phone: string
  alternatePhone?: string
  admissionNumber?: string
  aadhaarVerified?: boolean
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Store user session
      localStorage.setItem('userEmail', email)
      localStorage.setItem('isAuthenticated', 'true')
      
      console.log('Login successful')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, userData: UserData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store user data
      localStorage.setItem('userEmail', email)
      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('isAuthenticated', 'true')
      
      console.log('Signup successful', { email, userData })
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock Google user data
      const googleUser = {
        email: 'student@gmail.com',
        fullName: 'Google Student',
        avatar: 'https://lh3.googleusercontent.com/a/default-user'
      }
      
      localStorage.setItem('userEmail', googleUser.email)
      localStorage.setItem('userData', JSON.stringify(googleUser))
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('authMethod', 'google')
      
      console.log('Google login successful')
    } catch (error) {
      console.error('Google login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userData')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('authMethod')
  }

  const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true'
  }

  return {
    login,
    signup,
    loginWithGoogle,
    logout,
    isAuthenticated,
    isLoading
  }
} 