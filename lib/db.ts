import { promises as fs } from 'node:fs'
import path from 'node:path'

export interface DBUser {
  id: string
  email: string
  password: string
  name?: string
}

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'users.json')

async function readUsers(): Promise<DBUser[]> {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8')
    return JSON.parse(raw) as DBUser[]
  } catch (err: any) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

async function writeUsers(users: DBUser[]): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(users), 'utf8')
}

export async function addUser(user: DBUser): Promise<void> {
  const users = await readUsers()
  users.push(user)
  await writeUsers(users)
}

export async function findUserByEmail(email: string): Promise<DBUser | undefined> {
  const users = await readUsers()
  return users.find((u) => u.email === email)
}
