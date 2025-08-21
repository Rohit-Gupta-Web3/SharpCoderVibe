"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'

export function Profile() {
  const { user, logout } = useAuth()

  if (!user) {
    return <p className="mt-10 text-center">No user logged in.</p>
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Email: {user.email}</p>
        <div className="flex space-x-2">
          <Link href="/profile/settings">
            <Button variant="secondary">Settings</Button>
          </Link>
          <Button onClick={logout} variant="destructive">Logout</Button>
        </div>
      </CardContent>
    </Card>
  )
}
