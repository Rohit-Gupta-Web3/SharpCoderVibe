import { User, setSession, logout, getCurrentUser } from './session'

export { logout, getCurrentUser, User }

async function clientRequest(path: string, data: any, signal?: AbortSignal): Promise<User> {
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
  const user = payload as User
  setSession(user)
  return user
}

export async function signup(email: string, password: string, signal?: AbortSignal): Promise<User> {
  return clientRequest('/api/auth/signup', { email, password }, signal)
}

export async function login(email: string, password: string, signal?: AbortSignal): Promise<User> {
  return clientRequest('/api/auth/login', { email, password }, signal)
}
