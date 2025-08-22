import { NextResponse } from 'next/server'
import { logoutUser } from '@/lib/auth.server'

export async function POST(req: Request) {
  const { id } = await req.json().catch(() => ({}))
  if (!id) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  try {
    await logoutUser(id)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Logout failed' }, { status: 400 })
  }
}
