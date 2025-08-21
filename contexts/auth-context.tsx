"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import {
  login as loginSvc,
  signup as signupSvc,
  verify as verifySvc,
  logout as logoutSvc,
  getCurrentUser,
} from '@/lib/auth'
import type { User } from '@/lib/auth'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  verify: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser())

  const login = async (email: string, password: string) => {
    await loginSvc(email, password)
  }

  const signup = async (name: string, email: string, password: string) => {
    await signupSvc(name, email, password)
  }

  const verify = async (token: string) => {
    const u = await verifySvc(token)
    setUser(u)
  }

  const logout = () => {
    logoutSvc()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, verify, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
