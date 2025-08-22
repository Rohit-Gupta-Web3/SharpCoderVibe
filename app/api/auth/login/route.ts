import { NextResponse } from 'next/server'
import { login } from '@/lib/auth.server'

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}))
  if (!email || !password) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  try {
    const user = await login(email, password)
    return NextResponse.json(user)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 400 })
  }
}
