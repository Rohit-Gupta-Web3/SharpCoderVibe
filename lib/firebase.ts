import { cert, getApps, initializeApp, type AppOptions, type ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'
import { isAbsolute, join } from 'node:path'

let credJson: ServiceAccount | undefined
let projectId: string | undefined

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    credJson = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as ServiceAccount
    projectId = credJson.projectId ?? (credJson as Record<string, unknown>)['project_id'] as string | undefined
  } catch {
    // ignore invalid JSON in env variable
  }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  try {
    const p = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    const filePath = isAbsolute(p) ? p : join(process.cwd(), p)
    const contents = readFileSync(filePath, 'utf8')
    credJson = JSON.parse(contents) as ServiceAccount
    projectId = credJson.projectId ?? (credJson as Record<string, unknown>)['project_id'] as string | undefined
  } catch {
    // ignore missing or invalid credential file
  }
}

if (!projectId) {
  projectId = process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT ?? undefined
}

if (!getApps().length) {
  const options: AppOptions = {}
  if (credJson) options.credential = cert(credJson)
  if (projectId) options.projectId = projectId
  if (Object.keys(options).length) {
    initializeApp(options)
  } else {
    initializeApp()
  }
}

export const db = getFirestore()
