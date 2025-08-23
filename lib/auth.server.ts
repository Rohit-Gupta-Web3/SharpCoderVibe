import crypto from 'crypto'
import { authenticator } from 'otplib'
import { addUser, findUserByEmail } from './db'
import type { User } from './session'

export async function signup(name: string, email: string, password: string): Promise<{ user: User; otpauth: string }> {
  const existing = await findUserByEmail(email)
  if (existing) throw new Error('Email already registered')
  const id = crypto.randomUUID()
  const secret = authenticator.generateSecret()
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  await addUser({ id, email, name, password: hash, totpSecret: secret })
  const otpauth = authenticator.keyuri(email, 'SharpCoderVibe', secret)
  return { user: { id, email, name }, otpauth }
}

export async function login(email: string, password: string): Promise<User> {
  const user = await findUserByEmail(email)
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  if (!user || user.password !== hash) throw new Error('Invalid credentials')
  return { id: user.id, email: user.email, name: user.name }
}

export async function verify(email: string, token: string): Promise<User> {
  const user = await findUserByEmail(email)
  if (!user) throw new Error('User not found')
  const valid = authenticator.verify({ token, secret: user.totpSecret })
  if (!valid) throw new Error('Invalid code')
  return { id: user.id, email: user.email, name: user.name }
}
