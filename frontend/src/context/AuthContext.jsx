import { createContext, useContext, useState, useEffect } from 'react'
import API from '@/api/axios'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password })
    setUser(res.data.user)
    return res.data.user
  }

  const register = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password })
    setUser(res.data.user)
    return res.data.user
  }

  const logout = async () => {
    await API.post('/auth/logout')
    setUser(null)
  }

  const refreshUser = async () => {
    const res = await API.get('/auth/me')
    setUser(res.data)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}
