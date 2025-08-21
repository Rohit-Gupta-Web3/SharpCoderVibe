export interface User {
  id: string
  email: string
  password: string
  name?: string
}

const USERS_KEY = 'scv_users'
const CURRENT_USER_KEY = 'scv_current_user'

function loadUsers(): User[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as User[]) : []
  } catch {
    return []
  }
}

function saveUsers(users: User[]): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function setCurrentUser(user: User | null): void {
  if (typeof localStorage === 'undefined') return
  if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(CURRENT_USER_KEY)
}

export function getCurrentUser(): User | null {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(CURRENT_USER_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}

function simulateNetwork<T>(result: () => T, signal?: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }
    const timer = setTimeout(() => {
      try {
        resolve(result())
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

export async function signup(
  email: string,
  password: string,
  signal?: AbortSignal,
): Promise<User> {
  return simulateNetwork(() => {
    const users = loadUsers()
    if (users.some((u) => u.email === email)) {
      throw new Error('Email already registered')
    }
    const user: User = { id: crypto.randomUUID(), email, password }
    users.push(user)
    saveUsers(users)
    setCurrentUser(user)
    return user
  }, signal)
}

export async function login(
  email: string,
  password: string,
  signal?: AbortSignal,
): Promise<User> {
  return simulateNetwork(() => {
    const users = loadUsers()
    const user = users.find((u) => u.email === email)
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials')
    }
    setCurrentUser(user)
    return user
  }, signal)
}

export function logout(): void {
  setCurrentUser(null)
}
