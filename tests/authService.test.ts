/** @vitest-environment jsdom */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import path from 'path'
import { tmpdir } from 'os'
import fs from 'fs/promises'

process.env.DB_PATH = path.join(tmpdir(), 'auth-test-users.json')

import { signup, login, verifyOtp, logout, getCurrentUser } from '../lib/auth'
import * as server from '../lib/auth.server'
import { findUserByEmail } from '../lib/db'
import speakeasy from 'speakeasy'

function mockFetch() {
  vi.stubGlobal('fetch', (url: RequestInfo, options?: RequestInit) => {
    const { signal } = options ?? {}
    return new Promise<Response>((resolve, reject) => {
      if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'))
      const onAbort = () => reject(new DOMException('Aborted', 'AbortError'))
      signal?.addEventListener('abort', onAbort)
      setTimeout(async () => {
        try {
          const body = JSON.parse((options?.body as string) || '{}')
          let data: any
          if (url === '/api/auth/signup') {
            data = await server.signup(body.firstName, body.lastName, body.email, body.password)
          } else if (url === '/api/auth/login') {
            data = await server.login(body.email, body.password)
          } else if (url === '/api/auth/otp') {
            data = await server.verifyOtp(body.email, body.token)
          } else if (url === '/api/auth/logout') {
            await server.logoutUser(body.id)
            data = { ok: true }
          } else {
            throw new Error('Unknown endpoint')
          }
          resolve(new Response(JSON.stringify(data), { status: 200 }))
        } catch (err: any) {
          resolve(new Response(JSON.stringify({ error: err.message }), { status: 400 }))
        } finally {
          signal?.removeEventListener('abort', onAbort)
        }
      }, 0)
    })
  })
}

describe('auth service', () => {
  beforeEach(async () => {
    localStorage.clear()
    await fs.rm(process.env.DB_PATH!, { force: true })
    vi.unstubAllGlobals()
    mockFetch()
  })

  it('signs up, verifies otp, logs in again', async () => {
    await signup('Alice', 'Smith', 'a@test.com', 'pw')
    const userRec = await findUserByEmail('a@test.com')
    const token = speakeasy.totp({ secret: userRec!.authSecret, encoding: 'base32' })
    await verifyOtp('a@test.com', token)
    expect(getCurrentUser()?.firstName).toBe('Alice')
    await logout()
    const userRec2 = await findUserByEmail('a@test.com')
    expect(userRec2?.isLoggedIn).toBe(false)
    await login('a@test.com', 'pw')
    const token2 = speakeasy.totp({ secret: userRec2!.authSecret, encoding: 'base32' })
    await verifyOtp('a@test.com', token2)
    expect(getCurrentUser()?.email).toBe('a@test.com')
    const userRec3 = await findUserByEmail('a@test.com')
    expect(userRec3?.isLoggedIn).toBe(true)
  })

  it('rejects duplicate signup', async () => {
    await signup('Bob', 'User', 'b@test.com', 'pw')
    await expect(signup('Bob', 'User', 'b@test.com', 'pw')).rejects.toThrow(/already/i)
  })

  it('rejects invalid login', async () => {
    await signup('Eve', 'Smith', 'e@test.com', 'pw')
    await expect(login('e@test.com', 'bad')).rejects.toThrow(/invalid/i)
  })

  it('aborts requests', async () => {
    const ac = new AbortController()
    const promise = signup('Tom', 'Jones', 't@test.com', 'pw', ac.signal)
    ac.abort()
    await expect(promise).rejects.toThrow(/aborted/i)
  })
})
