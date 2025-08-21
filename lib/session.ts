export interface User {
  id: string
  email: string
  name?: string
}

const CURRENT_USER_KEY = 'scv_current_user'
const TOKEN_KEY = 'scv_token'
const EMAIL_KEY = 'scv_user_email'
const EXP_KEY = 'scv_token_expiry'

export function setSession(user: User): void {
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
