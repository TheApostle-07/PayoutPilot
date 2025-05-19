// File: web/app/mentor/profile/change-password/page.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Key } from 'lucide-react';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validate = () => {
    if (!currentPass) {
      setError('Please enter your current password.');
      return false;
    }
    if (newPass.length < 6) {
      setError('New password must be at least 6 characters.');
      return false;
    }
    if (newPass !== confirmPass) {
      setError('New password and confirmation do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validate()) return;

    setLoading(true);
    try {
      // --- Dummy delay to simulate real call ---
      await new Promise((res) => setTimeout(res, 1000));
      // If integrating with real backend:
      // 1) Reauthenticate user with currentPass
      // 2) Call updatePassword(newPass)
      // For now, we simulate success:
      setSuccess('Your password has been changed successfully.');
      // Optionally, sign out user so they must log in with new password:
      // await signOut();
      // router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6"
        noValidate
      >
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-indigo-700">
          <Key size={24} /> Change Password
        </h1>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}
        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded">{success}</div>
        )}

        <div>
          <label className="block text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            placeholder="At least 6 characters"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2 font-medium text-white rounded-lg transition ${
            loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Update Password'}
        </button>

        <p className="text-center text-sm text-gray-500">
          <a
            onClick={() => router.back()}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            ← Back to Profile
          </a>
        </p>
      </form>
    </div>
  );
}