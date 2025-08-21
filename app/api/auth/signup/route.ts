import { NextResponse } from 'next/server'
import { signup } from '@/lib/auth.server'

export async function POST(req: Request) {
  const { name, email, password } = await req.json().catch(() => ({}))
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  try {
    const { user, otpauth } = await signup(name, email, password)
    return NextResponse.json({ ...user, otpauth })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Signup failed' }, { status: 400 })
  }
}
