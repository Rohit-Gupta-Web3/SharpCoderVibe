import fs from 'fs/promises'
import type { Firestore } from 'firebase-admin/firestore'

export interface DBUser {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  authSecret: string
  isLoggedIn: boolean
}

const USERS = 'users'
let firestore: Firestore | undefined

async function getFirestore(): Promise<Firestore> {
  if (!firestore) {
    const mod = await import('./firebase')
    firestore = mod.db
  }
  return firestore
}

async function readUsers(p: string): Promise<DBUser[]> {
  try {
    const data = await fs.readFile(p, 'utf8')
    return JSON.parse(data) as DBUser[]
  } catch {
    return []
  }
}

async function writeUsers(p: string, users: DBUser[]): Promise<void> {
  await fs.writeFile(p, JSON.stringify(users), 'utf8')
}

export async function addUser(user: DBUser): Promise<void> {
  const filePath = process.env.DB_PATH
  if (filePath) {
    const users = await readUsers(filePath)
    users.push(user)
    await writeUsers(filePath, users)
    return
  }
  const db = await getFirestore()
  await db.collection(USERS).doc(user.id).set(user)
}

export async function findUserByEmail(email: string): Promise<DBUser | undefined> {
  const filePath = process.env.DB_PATH
  if (filePath) {
    const users = await readUsers(filePath)
    return users.find(u => u.email === email)
  }
  const db = await getFirestore()
  const snap = await db.collection(USERS).where('email', '==', email).limit(1).get()
  if (snap.empty) return undefined
  return snap.docs[0].data() as DBUser
}

export async function setLoginStatus(id: string, isLoggedIn: boolean): Promise<void> {
  const filePath = process.env.DB_PATH
  if (filePath) {
    const users = await readUsers(filePath)
    const idx = users.findIndex(u => u.id === id)
    if (idx !== -1) {
      users[idx].isLoggedIn = isLoggedIn
      await writeUsers(filePath, users)
    }
    return
  }
  const db = await getFirestore()
  await db.collection(USERS).doc(id).update({ isLoggedIn })
}

