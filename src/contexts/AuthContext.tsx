import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { apiClient } from '@/services/api'

// Types
export type UserRole = 'admin' | 'teacher' | 'student'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface AuthContextType {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'teacher', 'student']),
})

// Context
const AuthContext = createContext<AuthContextType | null>(null)

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedTokens = localStorage.getItem('auth_tokens')
    const storedUser = localStorage.getItem('auth_user')
    
    if (storedTokens && storedUser) {
      try {
        setTokens(JSON.parse(storedTokens))
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored auth data:', error)
        localStorage.removeItem('auth_tokens')
        localStorage.removeItem('auth_user')
      }
    }
    setIsLoading(false)
  }, [])

  // Setup token refresh
  useEffect(() => {
    if (!tokens) return

    const refreshInterval = setInterval(() => {
      refreshToken()
    }, 14 * 60 * 1000) // Refresh every 14 minutes

    return () => clearInterval(refreshInterval)
  }, [tokens])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // Validate input
      loginSchema.parse({ email, password })

      // Call API
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      })

      const { user: userData, tokens: newTokens } = response.data

      // Validate response
      const validatedUser = userSchema.parse(userData)

      // Update state
      setUser(validatedUser)
      setTokens(newTokens)

      // Store in localStorage
      localStorage.setItem('auth_tokens', JSON.stringify(newTokens))
      localStorage.setItem('auth_user', JSON.stringify(validatedUser))

      // Redirect based on role
      switch (validatedUser.role) {
        case 'admin':
          navigate('/admin/dashboard')
          break
        case 'teacher':
          navigate('/teacher/dashboard')
          break
        case 'student':
          navigate('/student/dashboard')
          break
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message)
      }
      throw error
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setTokens(null)
    localStorage.removeItem('auth_tokens')
    localStorage.removeItem('auth_user')
    navigate('/login')
  }

  // Refresh token function
  const refreshToken = async () => {
    if (!tokens?.refreshToken) return

    try {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken: tokens.refreshToken,
      })

      const { tokens: newTokens } = response.data
      setTokens(newTokens)
      localStorage.setItem('auth_tokens', JSON.stringify(newTokens))
    } catch (error) {
      console.error('Failed to refresh token:', error)
      logout()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isLoading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected Route component
export function ProtectedRoute({
  children,
  requiredRoles,
}: {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}) {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login')
    } else if (!isLoading && requiredRoles && !requiredRoles.includes(user!.role)) {
      navigate('/unauthorized')
    }
  }, [user, isLoading, requiredRoles, navigate])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || (requiredRoles && !requiredRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
} 