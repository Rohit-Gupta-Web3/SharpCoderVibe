"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { getStoredEmail } from '@/lib/auth'

export function LoginForm() {
  const { login, verify } = useAuth()
  const router = useRouter()
  const [stage, setStage] = useState<'credentials' | 'otp'>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedEmail = getStoredEmail()
    const exp = typeof localStorage !== 'undefined' ? localStorage.getItem('scv_token_expiry') : null
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('scv_token') : null
    if (!token && storedEmail && exp && Number(exp) > Date.now()) {
      setEmail(storedEmail)
      setStage('otp')
    } else if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (stage === 'credentials') {
        await login(email, password)
        setStage('otp')
      } else {
        await verify(code)
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || (stage === 'credentials' ? 'Login failed' : 'Verification failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} noValidate>
        <CardHeader>
          <CardTitle>{stage === 'credentials' ? 'Login' : 'Enter Code'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stage === 'credentials' ? (
            <>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-sm">Enter the code from your authenticator app.</p>
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">Code</label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (stage === 'credentials' ? 'Logging in...' : 'Verifying...') : stage === 'credentials' ? 'Login' : 'Verify'}
          </Button>
          {stage === 'credentials' && (
            <p className="text-sm text-center">
              No account? <Link href="/signup" className="underline">Sign up</Link>
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
