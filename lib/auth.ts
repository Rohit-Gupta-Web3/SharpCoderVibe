import { setSession, logout as clearSession, getCurrentUser, setOtpVerified } from './session'
import type { User } from './session'

export { getCurrentUser }
export type { User }

async function clientRequest(path: string, data: any, signal?: AbortSignal): Promise<any> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal,
  })
  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(payload.error || 'Request failed')
  }
  return payload
}

export async function signup(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  signal?: AbortSignal,
): Promise<{ user: User; otpauthUrl: string }> {
  const res = await clientRequest('/api/auth/signup', { firstName, lastName, email, password }, signal)
  const user = { id: res.user.id, email: res.user.email, firstName: res.user.firstName, lastName: res.user.lastName } as User
  return { user, otpauthUrl: res.otpauthUrl }
}

export async function login(
  email: string,
  password: string,
  signal?: AbortSignal,
): Promise<User> {
  const res = await clientRequest('/api/auth/login', { email, password }, signal)
  return { id: res.id, email: res.email, firstName: res.firstName, lastName: res.lastName } as User
}

export async function verifyOtp(
  email: string,
  token: string,
  signal?: AbortSignal,
): Promise<User> {
  const res = await clientRequest('/api/auth/otp', { email, token }, signal)
  const user = { id: res.id, email: res.email, firstName: res.firstName, lastName: res.lastName } as User
  setSession(user)
  setOtpVerified(true)
  return user
}

export async function logout(): Promise<void> {
  const user = getCurrentUser()
  if (user) {
    try {
      await clientRequest('/api/auth/logout', { id: user.id })
    } catch {
      /* ignore network errors on logout */
    }
  }
  clearSession()
}
