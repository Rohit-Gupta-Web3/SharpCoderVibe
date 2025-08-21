/** @vitest-environment node */

import { describe, it, expect, beforeEach } from 'vitest'
import path from 'path'
import { tmpdir } from 'os'
import fs from 'fs/promises'

process.env.DB_PATH = path.join(tmpdir(), 'db-test.json')
import { addUser, findUserByEmail } from '../lib/db'

beforeEach(async () => {
  await fs.rm(process.env.DB_PATH!, { force: true })
})

describe('database', () => {
  it('persists and retrieves users', async () => {
    await addUser({ id: '1', email: 'a@test.com', password: 'pw' })
    const user = await findUserByEmail('a@test.com')
    expect(user?.email).toBe('a@test.com')
  })
})
