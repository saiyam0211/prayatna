import { useState } from 'react'

interface UserData {
  fullName: string
  dateOfBirth?: Date
  primaryDiagnosis: string
  medications: string
  phone: string
  avatar?: File | null
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, accept any email/password
      console.log('Login successful:', { email })
      
      // Store user session (in real app, this would be JWT or session)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', email)
      
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, userData: UserData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Signup successful:', { email, userData })
      
      // Store user session
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', email)
      localStorage.setItem('userData', JSON.stringify(userData))
      
    } catch (error) {
      console.error('Signup failed:', error)
      throw new Error('Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithApple = async () => {
    setIsLoading(true)
    try {
      // Simulate Apple sign-in
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Apple sign-in successful')
      
      // Store user session
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', 'apple.user@example.com')
      
    } catch (error) {
      console.error('Apple sign-in failed:', error)
      throw new Error('Apple sign-in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userData')
  }

  const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true'
  }

  return {
    login,
    signup,
    loginWithApple,
    logout,
    isAuthenticated,
    isLoading
  }
} 