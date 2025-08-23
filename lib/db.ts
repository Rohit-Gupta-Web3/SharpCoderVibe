import { db } from './firebase'

export interface DBUser {
  id: string
  email: string
  password: string
  name?: string
  totpSecret: string
}

const USERS = 'users'

export async function addUser(user: DBUser): Promise<void> {
  await db.collection(USERS).doc(user.id).set(user)
}

export async function findUserByEmail(email: string): Promise<DBUser | undefined> {
  const snap = await db.collection(USERS).where('email', '==', email).limit(1).get()
  if (snap.empty) return undefined
  return snap.docs[0].data() as DBUser
}
