'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Image from 'next/image';
import {
  signUp,
  getIdToken,
  signInWithGoogle,
} from '../../src/lib/firebaseClient';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [role, setRole] = useState<'admin' | 'edtech' | 'mentor'>('mentor');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    pw: '',
  });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let ok = true;
    const errs = { email: '', pw: '' };
    if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email.';
      ok = false;
    }
    if (pw.length < 6) {
      errs.pw = 'Password must be at least 6 characters.';
      ok = false;
    }
    setFieldErrors(errs);
    return ok;
  };

  const register = async (idToken: string) => {
    const res = await fetch('http://localhost:4000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, role }),
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'Registration failed');
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await signUp(email, pw);
      const idToken = await getIdToken();
      await register(idToken);
      router.push('/login');
    } catch (err: any) {
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'That email is already registered.'
          : err.message || 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      const idToken = await getIdToken();
      await register(idToken);
      router.push(role === 'mentor' ? '/mentor/dashboard' : '/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50 p-4">
      <form
        onSubmit={onSubmit}
        noValidate
        className="relative w-full max-w-lg bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Create an Account
        </h2>

        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              disabled={loading}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {fieldErrors.pw && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.pw}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              disabled={loading}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              <option value="admin">Admin</option>
              <option value="edtech">EdTech Admin</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition 
            ${
              loading
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
            }`}
        >
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>

        {/* OR Divider */}
        <div className="relative text-center my-4">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 bg-white px-2 text-gray-500">
            Or
          </span>
          <div className="border-t border-gray-300"></div>
        </div>

        {/* Google Sign Up */}
        <button
          type="button"
          onClick={onGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-60"
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            width={20}
            height={20}
          />
          {loading ? 'Please wait…' : 'Sign up with Google'}
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-indigo-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}