'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image';
import { Loader2 } from 'lucide-react'
import {
  signIn,
  signInWithGoogle,
  getIdToken,
} from '../../src/lib/firebaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const redirectByRole = async () => {
    const token = await getIdToken()
    const res = await fetch('http://localhost:4000/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()
    if (!json.ok) throw new Error(json.error || 'Could not fetch profile')

    const role = json.user.role as string
    switch (role) {
      case 'admin':
        router.replace('/admin/dashboard')
        break
      case 'edtech':
        router.replace('/edtech/dashboard')
        break
      default:
        router.replace('/mentor/dashboard')
    }
  }

  const onEmailLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !pw) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)
    try {
      await signIn(email.trim(), pw)
      await redirectByRole()
    } catch (err: any) {
      switch (err.code) {
        case 'auth/wrong-password':
          setError('Incorrect password.')
          break
        case 'auth/user-not-found':
          setError('No account found with that email.')
          break
        default:
          setError(err.message || 'Login failed, please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const onGoogleLogin = async () => {
    setError(null)
    setLoading(true)
    try {
      await signInWithGoogle()
      await redirectByRole()
    } catch (_err) {
      setError('Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full -mx-6 -my-6 md:-mx-8 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-50">
      <div className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur p-8 rounded-2xl shadow-lg border border-white border-opacity-20">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}

        <form onSubmit={onEmailLogin} noValidate className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-2 font-medium text-white rounded-lg transition ${
              loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-2">
          <span className="h-px w-16 bg-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <span className="h-px w-16 bg-gray-300" />
        </div>

        <button
          onClick={onGoogleLogin}
          disabled={loading}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg transition ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            width={20}
            height={20}
          />
          {loading ? 'Please wait…' : 'Sign in with Google'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link href="/register" className="text-indigo-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}