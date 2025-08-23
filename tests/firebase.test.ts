/** @vitest-environment node */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mkdtemp, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

const initializeApp = vi.fn()
const getApps = vi.fn(() => [])
const cert = vi.fn((cred: unknown) => cred)

vi.mock('firebase-admin/app', () => ({ initializeApp, getApps, cert }))
vi.mock('firebase-admin/firestore', () => ({ getFirestore: vi.fn(() => ({})) }))

describe('firebase initialization', () => {
  let cwdSpy: ReturnType<typeof vi.spyOn> | undefined

  beforeEach(() => {
    vi.resetModules()
    initializeApp.mockClear()
    getApps.mockReturnValue([])
    delete process.env.FIREBASE_SERVICE_ACCOUNT
    delete process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    delete process.env.GCLOUD_PROJECT
    delete process.env.GOOGLE_CLOUD_PROJECT
    cwdSpy?.mockRestore()
    cwdSpy = undefined
  })

  it('uses credentials from FIREBASE_SERVICE_ACCOUNT env variable', async () => {
    process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({ project_id: 'env' })
    await import('../lib/firebase')
    expect(initializeApp).toHaveBeenCalledWith({
      credential: { project_id: 'env' },
      projectId: 'env',
    })
  })

  it('uses credentials from FIREBASE_SERVICE_ACCOUNT_PATH when provided', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'firebase-test-'))
    const credPath = join(dir, 'firebase.json')
    await writeFile(credPath, JSON.stringify({ project_id: 'file' }), 'utf8')
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH = credPath
    await import('../lib/firebase')
    expect(initializeApp).toHaveBeenCalledWith({
      credential: { project_id: 'file' },
      projectId: 'file',
    })
  })

  it('initializes without credentials if none are available', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'firebase-test-'))
    cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(dir)
    await import('../lib/firebase')
    expect(initializeApp).toHaveBeenCalledWith()
  })

  it('uses GCLOUD_PROJECT when no credentials are provided', async () => {
    process.env.GCLOUD_PROJECT = 'gc-env'
    await import('../lib/firebase')
    expect(initializeApp).toHaveBeenCalledWith({ projectId: 'gc-env' })
  })

  it('uses GOOGLE_CLOUD_PROJECT when GCLOUD_PROJECT is absent', async () => {
    process.env.GOOGLE_CLOUD_PROJECT = 'gcp-env'
    await import('../lib/firebase')
    expect(initializeApp).toHaveBeenCalledWith({ projectId: 'gcp-env' })
  })

  it('ignores invalid JSON from FIREBASE_SERVICE_ACCOUNT', async () => {
    process.env.FIREBASE_SERVICE_ACCOUNT = '{ invalid'
    await import('../lib/firebase')
    expect(initializeApp).toHaveBeenCalledWith()
  })
})
