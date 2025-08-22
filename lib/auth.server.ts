import crypto from 'crypto'
import speakeasy from 'speakeasy'
import { addUser, findUserByEmail, setLoginStatus } from './db'
import type { User } from './session'

export async function signup(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<{ user: User; otpauthUrl: string }> {
  const existing = await findUserByEmail(email)
  if (existing) throw new Error('Email already registered')
  const id = crypto.randomUUID()
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  const secret = speakeasy.generateSecret({ name: `SharpCoderVibe:${email}` })
  await addUser({
    id,
    email,
    password: hash,
    firstName,
    lastName,
    authSecret: secret.base32,
    isLoggedIn: false,
  })
  return { user: { id, email, firstName, lastName }, otpauthUrl: secret.otpauth_url! }
}

export async function login(email: string, password: string): Promise<User> {
  const user = await findUserByEmail(email)
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  if (!user || user.password !== hash) throw new Error('Invalid credentials')
  return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
}

export async function verifyOtp(email: string, token: string): Promise<User> {
  const user = await findUserByEmail(email)
  if (!user) throw new Error('User not found')
  const ok = speakeasy.totp.verify({ secret: user.authSecret, encoding: 'base32', token, window: 1 })
  if (!ok) throw new Error('Invalid authenticator code')
  await setLoginStatus(user.id, true)
  return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
}

export async function logoutUser(id: string): Promise<void> {
  await setLoginStatus(id, false)
}
