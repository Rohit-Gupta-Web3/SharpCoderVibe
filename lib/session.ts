export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

const CURRENT_USER_KEY = 'scv_current_user'
const TOKEN_KEY = 'scv_token'
const EXP_KEY = 'scv_token_expiry'
const OTP_KEY = 'scv_otp_verified'

export function setSession(user: User): void {
  if (typeof localStorage === 'undefined') return
  const token = crypto.randomUUID()
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  localStorage.setItem(EXP_KEY, String(Date.now() + 60 * 60 * 1000))
  localStorage.setItem(OTP_KEY, 'false')
}

export function logout(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(CURRENT_USER_KEY)
  localStorage.removeItem(EXP_KEY)
  localStorage.removeItem(OTP_KEY)
}

export function getCurrentUser(): User | null {
  if (typeof localStorage === 'undefined') return null
  const token = localStorage.getItem(TOKEN_KEY)
  const exp = localStorage.getItem(EXP_KEY)
  if (!token || !exp || Number(exp) < Date.now()) {
    return null
  }
  const raw = localStorage.getItem(CURRENT_USER_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}

export function setOtpVerified(val: boolean): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(OTP_KEY, val ? 'true' : 'false')
}

export function isOtpVerified(): boolean {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(OTP_KEY) === 'true'
}
