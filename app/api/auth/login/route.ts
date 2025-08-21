import { NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/db'

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}))
  if (!email || !password) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const user = await findUserByEmail(email)
  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
  }
  return NextResponse.json({ id: user.id, email: user.email })
}
