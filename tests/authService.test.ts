/** @vitest-environment jsdom */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import path from 'path'
import { tmpdir } from 'os'
import fs from 'fs/promises'
import { generateToken } from '../lib/totp'

process.env.DB_PATH = path.join(tmpdir(), 'auth-test-users.json')

import { signup, login, verify, getCurrentUser } from '../lib/auth'
import * as server from '../lib/auth.server'

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
            data = await server.signup(body.name, body.email, body.password)
          } else if (url === '/api/auth/login') {
            data = await server.login(body.email, body.password)
          } else if (url === '/api/auth/verify') {
            data = await server.verify(body.email, body.token)
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

  it('signs up, logs in, verifies, and stores session', async () => {
    await signup('Alice', 'a@test.com', 'pw')
    await login('a@test.com', 'pw')
    const otpauth = localStorage.getItem('scv_otpauth')!
    const secret = new URL(otpauth).searchParams.get('secret')!
    const code = generateToken(secret)
    await verify(code)
    expect(getCurrentUser()?.email).toBe('a@test.com')
  })

  it('rejects duplicate signup', async () => {
    await signup('Bob', 'b@test.com', 'pw')
    await expect(signup('Bob', 'b@test.com', 'pw')).rejects.toThrow(/already/i)
  })

  it('rejects invalid login', async () => {
    await signup('Eve', 'e@test.com', 'pw')
    await expect(login('e@test.com', 'bad')).rejects.toThrow(/invalid/i)
  })

  it('aborts requests', async () => {
    const ac = new AbortController()
    const promise = signup('Tom', 't@test.com', 'pw', ac.signal)
    ac.abort()
    await expect(promise).rejects.toThrow(/aborted/i)
  })
})
