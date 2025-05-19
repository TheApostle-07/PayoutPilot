'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser, initFirebase } from '../../../src/lib/firebaseClient'
import { User as UserIcon, Edit3, Key } from 'lucide-react'
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { getAuth } from 'firebase/auth'

export default function ProfilePage() {
  const user = useUser()
  const router = useRouter()

  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '')
    }
  }, [user])

  async function handleSave() {
    setError(null)
    setSuccess(null)
    if (!displayName.trim()) {
      setError('Name cannot be empty.')
      return
    }
    initFirebase()
    const auth = getAuth()
    if (!auth.currentUser) {
      setError('Not authenticated.')
      return
    }
    setSaving(true)
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() })
      setSuccess('Profile updated successfully.')
      setEditing(false)
    } catch (e: any) {
      setError(e.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return <div className="flex items-center justify-center py-20">Loading profile...</div>
  }

  const initials = (user.displayName || user.email || '')
    .split(/[^A-Za-z0-9]+/)
    .map(w => w[0])
    .join('')
    .toUpperCase() || <UserIcon size={24} />

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

      {/* Profile Header */}
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-semibold" style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}>
          {initials}
        </div>
        <div className="flex-1">
          <p className="text-xl font-medium text-gray-900 break-all">{user.displayName || user.email}</p>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>
        <button
          onClick={() => { setEditing(true); setSuccess(null); setError(null) }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="space-y-4">
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              disabled={saving}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Security Section */}
      <div className="border-t pt-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Account Security</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key size={20} className="text-gray-500" />
            <p className="text-gray-700">Change Password</p>
          </div>
          <Link href="/mentor/profile/change-password" className="text-indigo-600 hover:underline font-medium">
            Update Password
          </Link>
        </div>
      </div>
    </div>
  )
}