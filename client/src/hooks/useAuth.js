import { useState, useEffect, createContext, useContext } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('geosync_token')
    const savedUser = localStorage.getItem('geosync_user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password })
      setToken(data.token)
      setUser(data.user)
      
      localStorage.setItem('geosync_token', data.token)
      localStorage.setItem('geosync_user', JSON.stringify(data.user))
      
      return data
    } catch (error) {
      throw error
    }
  }

  const register = async (name, email, password) => {
    try {
      const data = await api.post('/auth/register', { name, email, password })
      setToken(data.token)
      setUser(data.user)
      
      localStorage.setItem('geosync_token', data.token)
      localStorage.setItem('geosync_user', JSON.stringify(data.user))
      
      return data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('geosync_token')
    localStorage.removeItem('geosync_user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
