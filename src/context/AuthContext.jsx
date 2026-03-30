/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('isAdmin') === 'true'
  })

  function login(password) {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('isAdmin', 'true')
      setIsAdmin(true)
      return true
    }
    return false
  }

  function logout() {
    sessionStorage.removeItem('isAdmin')
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
