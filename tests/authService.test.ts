/** @vitest-environment jsdom */

import { describe, it, expect, beforeEach } from 'vitest'
import { signup, login, logout, getCurrentUser } from '../lib/auth'

describe('auth service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('signs up and logs in user', async () => {
    const user = await signup('a@test.com', 'pw')
    expect(user.email).toBe('a@test.com')
    logout()
    const logged = await login('a@test.com', 'pw')
    expect(logged.email).toBe('a@test.com')
    expect(getCurrentUser()?.email).toBe('a@test.com')
  })

  it('rejects duplicate signup', async () => {
    await signup('a@test.com', 'pw')
    await expect(signup('a@test.com', 'pw')).rejects.toThrow(/already/i)
  })

  it('rejects invalid login', async () => {
    await signup('a@test.com', 'pw')
    await expect(login('a@test.com', 'wrong')).rejects.toThrow(/invalid/i)
  })

  it('aborts requests', async () => {
    const ac = new AbortController()
    const promise = signup('b@test.com', 'pw', ac.signal)
    ac.abort()
    await expect(promise).rejects.toThrow(/aborted/i)
  })
})
