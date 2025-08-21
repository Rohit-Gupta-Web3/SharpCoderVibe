import { NextResponse } from 'next/server'
import { addUser, findUserByEmail, DBUser } from '@/lib/db'

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}))
  if (!email || !password) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const existing = await findUserByEmail(email)
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
  }
  const user: DBUser = { id: crypto.randomUUID(), email, password }
  await addUser(user)
  return NextResponse.json({ id: user.id, email: user.email })
}
