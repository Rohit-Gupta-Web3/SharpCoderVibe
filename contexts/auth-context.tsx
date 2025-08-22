"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import {
  login as loginSvc,
  signup as signupSvc,
  logout as logoutSvc,
  verifyOtp as verifyOtpSvc,
  getCurrentUser,
} from '@/lib/auth'
import type { User } from '@/lib/auth'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<string>
  verifyOtp: (email: string, token: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser())

  const login = async (email: string, password: string) => {
    await loginSvc(email, password)
  }

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    const res = await signupSvc(firstName, lastName, email, password)
    return res.otpauthUrl
  }

  const verifyOtp = async (email: string, token: string) => {
    const u = await verifyOtpSvc(email, token)
    setUser(u)
  }

  const logout = async () => {
    await logoutSvc()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
