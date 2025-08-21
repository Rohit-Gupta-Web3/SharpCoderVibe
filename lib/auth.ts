import {
  User,
  setSession,
  logout,
  getCurrentUser,
  setPending,
  getStoredEmail,
  getStoredName,
} from './session'

export { logout, getCurrentUser, User, getStoredEmail, getStoredName }

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

export async function signup(name: string, email: string, password: string, signal?: AbortSignal): Promise<void> {
  const res = await clientRequest('/api/auth/signup', { name, email, password }, signal)
  setPending(res.email, res.name)
  if (res.otpauth) localStorage.setItem('scv_otpauth', res.otpauth)
}

export async function login(email: string, password: string, signal?: AbortSignal): Promise<void> {
  const res = await clientRequest('/api/auth/login', { email, password }, signal)
  setPending(res.email, res.name)
}

export async function verify(token: string, signal?: AbortSignal): Promise<User> {
  const email = getStoredEmail()
  if (!email) throw new Error('No email stored')
  const user = await clientRequest('/api/auth/verify', { email, token }, signal)
  setSession(user as User)
  localStorage.removeItem('scv_otpauth')
  return user as User
}
