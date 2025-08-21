import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const credJson = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined

if (!getApps().length) {
  if (credJson) {
    initializeApp({ credential: cert(credJson) })
  } else {
    initializeApp()
  }
}

export const db = getFirestore()
