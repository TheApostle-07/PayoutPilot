// File: web/src/lib/firebaseClient.ts
'use client'

import React from 'react'
import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import {
  getAuth,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  Auth,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey:             process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId:  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:              process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

let auth: Auth | null = null

function initFirebase() {
  if (typeof window === 'undefined') return
  if (!auth) {
    const app: FirebaseApp = getApps().length
      ? (getApps()[0] as FirebaseApp)
      : initializeApp(firebaseConfig)
    auth = getAuth(app)
  }
}

/** Subscribe to auth state changes */
export function useUser(callback?: (u: User | null) => void): User | null {
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    initFirebase()
    if (!auth) return
    const unsub = onIdTokenChanged(auth, u => {
      setUser(u)
      callback?.(u)
    })
    return unsub
  }, [callback])

  return user
}

/** Grab the current Firebase ID token (JWT) */
export async function getIdToken(): Promise<string> {
  if (!auth || !auth.currentUser) {
    throw new Error('Not signed in')
  }
  return auth.currentUser.getIdToken()
}

/** Email/password sign-in */
export async function signIn(email: string, pass: string) {
  initFirebase()
  if (!auth) throw new Error('Firebase not initialized')
  return signInWithEmailAndPassword(auth, email, pass)
}

/** Email/password sign-up */
export async function signUp(email: string, pass: string) {
  initFirebase()
  if (!auth) throw new Error('Firebase not initialized')
  return createUserWithEmailAndPassword(auth, email, pass)
}

/** Google OAuth popup */
export async function signInWithGoogle() {
  initFirebase()
  if (!auth) throw new Error('Firebase not initialized')
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

/** Sign-out */
export function signOut() {
  initFirebase()
  return auth ? firebaseSignOut(auth) : Promise.resolve()
}