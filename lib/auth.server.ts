import { addUser, findUserByEmail } from './db'
import { User } from './session'

export async function signup(email: string, password: string): Promise<User> {
  const existing = await findUserByEmail(email)
  if (existing) {
    throw new Error('Email already registered')
  }
  const user = { id: crypto.randomUUID(), email, password }
  await addUser(user)
  return { id: user.id, email: user.email }
}

export async function login(email: string, password: string): Promise<User> {
  const user = await findUserByEmail(email)
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials')
  }
  return { id: user.id, email: user.email }
}
