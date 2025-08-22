import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'
import { isAbsolute, join } from 'node:path'

let credJson: Record<string, unknown> | undefined

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    credJson = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  } catch {
    // ignore invalid JSON in env variable
  }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  try {
    const p = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    const filePath = isAbsolute(p) ? p : join(process.cwd(), p)
    const contents = readFileSync(filePath, 'utf8')
    credJson = JSON.parse(contents)
  } catch {
    // ignore missing or invalid credential file
  }
}

if (!getApps().length) {
  if (credJson) {
    initializeApp({ credential: cert(credJson) })
  } else {
    initializeApp()
  }
}

export const db = getFirestore()
