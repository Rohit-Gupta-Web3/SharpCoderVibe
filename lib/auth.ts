export interface User {
  id: string
  email: string
  name?: string
}

const CURRENT_USER_KEY = 'scv_current_user'
const TOKEN_KEY = 'scv_token'
const EMAIL_KEY = 'scv_user_email'
const EXP_KEY = 'scv_token_expiry'

function setSession(user: User): void {
  if (typeof localStorage === 'undefined') return
  const token = crypto.randomUUID()
  const expires = Date.now() + 60 * 60 * 1000
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(EMAIL_KEY, user.email)
  localStorage.setItem(EXP_KEY, String(expires))
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export function logout(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EMAIL_KEY)
  localStorage.removeItem(EXP_KEY)
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getCurrentUser(): User | null {
  if (typeof localStorage === 'undefined') return null
  const token = localStorage.getItem(TOKEN_KEY)
  const email = localStorage.getItem(EMAIL_KEY)
  const exp = localStorage.getItem(EXP_KEY)
  if (!token || !email || !exp || Number(exp) < Date.now()) {
    return null
  }
  const raw = localStorage.getItem(CURRENT_USER_KEY)
  return raw ? (JSON.parse(raw) as User) : { id: '', email }
}

function simulateNetwork<T>(fn: () => Promise<T> | T, signal?: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'))
    const timer = setTimeout(async () => {
      try {
        resolve(await fn())
      } catch (err) {
        reject(err)
      }
    }, 10)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

async function serverSignup(email: string, password: string, signal?: AbortSignal): Promise<User> {
  return simulateNetwork(async () => {
    const { addUser, findUserByEmail } = await import('./db')
    const exists = await findUserByEmail(email)
    if (exists) throw new Error('Email already registered')
    const user = { id: crypto.randomUUID(), email, password }
    await addUser(user)
    const u = { id: user.id, email: user.email }
    setSession(u)
    return u
  }, signal)
}

async function serverLogin(email: string, password: string, signal?: AbortSignal): Promise<User> {
  return simulateNetwork(async () => {
    const { findUserByEmail } = await import('./db')
    const user = await findUserByEmail(email)
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials')
    }
    const u = { id: user.id, email: user.email }
    setSession(u)
    return u
  }, signal)
}

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

const isServer = typeof window === 'undefined' || process.env.NODE_ENV === 'test'

export async function signup(email: string, password: string, signal?: AbortSignal): Promise<User> {
  if (isServer) return serverSignup(email, password, signal)
  return clientRequest('/api/auth/signup', { email, password }, signal)
}

export async function login(email: string, password: string, signal?: AbortSignal): Promise<User> {
  if (isServer) return serverLogin(email, password, signal)
  return clientRequest('/api/auth/login', { email, password }, signal)
}
