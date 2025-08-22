import { NextResponse } from 'next/server'
import { signup } from '@/lib/auth.server'

export async function POST(req: Request) {
  const { firstName, lastName, email, password } = await req.json().catch(() => ({}))
  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  try {
    const { user, otpauthUrl } = await signup(firstName, lastName, email, password)
    return NextResponse.json({ user, otpauthUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Signup failed' }, { status: 400 })
  }
}
