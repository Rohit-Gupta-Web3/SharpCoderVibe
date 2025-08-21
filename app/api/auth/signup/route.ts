import { NextResponse } from 'next/server'
import { signup } from '@/lib/auth.server'

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}))
  if (!email || !password) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  try {
    const user = await signup(email, password)
    return NextResponse.json(user)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Email already registered' }, { status: 400 })
  }
}
