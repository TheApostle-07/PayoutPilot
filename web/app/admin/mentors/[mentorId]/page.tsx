'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Edit2, Trash2, ToggleRight, User, MessageSquare, CalendarDays } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Modal from '../../../../src/components/Modal'; // assume you have a reusable Modal
import Link from 'next/link';

interface Mentor {
  id: string;
  name: string;
  email: string;
  role: 'Mentor';
  active: boolean;
  totalSessions: number;
  totalPayout: number;
}

export default function MentorDetailPage({
  params,
}: {
  params: { mentorId: string };
}) {
  const { mentorId } = params;
  const router = useRouter();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Fetch mentor details (simulate with dummy data)
    setLoading(true);
    setError(null);
    setTimeout(() => {
      // Dummy data
      setMentor({
        id: mentorId,
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        role: 'Mentor',
        active: true,
        totalSessions: 42,
        totalPayout: 172000,
      });
      setLoading(false);
    }, 600);
  }, [mentorId]);

  const handleDelete = async () => {
    if (!mentor) return;
    if (!confirm(`Are you sure you want to delete mentor ${mentor.name}?`)) return;
    // TODO: call DELETE API
    router.push('/admin/mentors');
  };

  const handleToggleActive = async () => {
    if (!mentor) return;
    setUpdating(true);
    // TODO: call PATCH API
    setMentor({ ...mentor, active: !mentor.active });
    setUpdating(false);
  };

  const handleSave = async (name: string, email: string) => {
    if (!mentor) return;
    setUpdating(true);
    // TODO: call PATCH API
    setMentor({ ...mentor, name, email });
    setUpdating(false);
    setShowEdit(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="text-center py-20 text-red-600">
        {error ?? 'Mentor not found.'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl">
            <User size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{mentor.name}</h1>
            <p className="text-sm text-gray-500">{mentor.email}</p>
          </div>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded ${
              mentor.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {mentor.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 transition"
          >
            <Edit2 size={16} /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
          >
            <Trash2 size={16} /> Delete
          </button>
          <button
            onClick={handleToggleActive}
            disabled={updating}
            className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
          >
            <ToggleRight size={16} />
            {updating ? '...' : mentor.active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Sessions</p>
            <p className="text-xl font-semibold">{mentor.totalSessions}</p>
          </div>
          <CalendarDays size={28} className="text-indigo-400" />
        </div>
        <div className="bg-indigo-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Payout</p>
            <p className="text-xl font-semibold">₹{mentor.totalPayout.toLocaleString()}</p>
          </div>
          <MessageSquare size={28} className="text-indigo-400" />
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div>
        <h2 className="text-lg font-medium mb-3">Recent Sessions</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Session ID</th>
                <th className="p-2 text-left">Duration</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2025-05-01', id: 'S1001', duration: '1h 0m', amount: 4000 },
                { date: '2025-04-28', id: 'S1000', duration: '0h 45m', amount: 3000 },
              ].map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{new Date(s.date).toLocaleDateString()}</td>
                  <td className="p-2">{s.id}</td>
                  <td className="p-2">{s.duration}</td>
                  <td className="p-2">₹{s.amount.toLocaleString()}</td>
                  <td className="p-2 text-right">
                    <Link
                      href={`/admin/sessions/${s.id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <Modal onClose={() => setShowEdit(false)} title="Edit Mentor">
          <EditMentorForm
            initialName={mentor.name}
            initialEmail={mentor.email}
            onSave={handleSave}
            onCancel={() => setShowEdit(false)}
          />
        </Modal>
      )}
    </div>
  );
}

/** A simple form used inside the edit modal */
function EditMentorForm({
  initialName,
  initialEmail,
  onSave,
  onCancel,
}: {
  initialName: string;
  initialEmail: string;
  onSave: (name: string, email: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError('Name and email cannot be empty.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    onSave(name.trim(), email.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 w-full border-gray-300 rounded focus:ring focus:ring-indigo-200 p-2"
        />
      </div>
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mt-1 w-full border-gray-300 rounded focus:ring focus:ring-indigo-200 p-2"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Save
        </button>
      </div>
    </form>
  );
}