"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { login as loginSvc, signup as signupSvc, logout as logoutSvc, getCurrentUser, User } from '@/lib/auth'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser())

  const login = async (email: string, password: string) => {
    const u = await loginSvc(email, password)
    setUser(u)
  }

  const signup = async (email: string, password: string) => {
    const u = await signupSvc(email, password)
    setUser(u)
  }

  const logout = () => {
    logoutSvc()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
