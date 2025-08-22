import { NextResponse } from 'next/server'
import { verifyOtp } from '@/lib/auth.server'

export async function POST(req: Request) {
  const { email, token } = await req.json().catch(() => ({}))
  if (!email || !token) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  try {
    const user = await verifyOtp(email, token)
    return NextResponse.json(user)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'OTP verification failed' }, { status: 400 })
  }
}
