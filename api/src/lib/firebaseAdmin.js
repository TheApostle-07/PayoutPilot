// api/src/lib/firebaseAdmin.js
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { join } from 'path'

// load your service account JSON (download from Firebase console)
const serviceAccount = JSON.parse(
  readFileSync(join(process.cwd(), 'serviceAccountKey.json'), 'utf-8')
)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export const authAdmin = admin.auth()