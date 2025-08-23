"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

export default function SetupAuthenticatorPage() {
  const { verify } = useAuth()
  const router = useRouter()
  const [qr, setQr] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const otpauth = localStorage.getItem('scv_otpauth')
    if (!otpauth) {
      router.replace('/login')
      return
    }
    QRCode.toDataURL(otpauth).then(setQr).catch(() => setError('Failed to generate QR code'))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await verify(code)
      router.replace('/')
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} noValidate>
        <CardHeader>
          <CardTitle>Set up Authenticator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {qr && <img src={qr} alt="Authenticator QR" className="mx-auto" />}
          <p className="text-sm text-center">Scan the QR code with Microsoft Authenticator and enter the code below.</p>
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">Code</label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
