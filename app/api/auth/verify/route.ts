import { NextResponse } from 'next/server'
import { verify } from '@/lib/auth.server'

export async function POST(req: Request) {
  const { email, token } = await req.json().catch(() => ({}))
  if (!email || !token) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  try {
    const user = await verify(email, token)
    return NextResponse.json(user)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid code' }, { status: 400 })
  }
}
