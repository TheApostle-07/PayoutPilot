'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Loader2,
  Users as UsersIcon,
  Search,
  Filter,
  DownloadCloud,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from 'lucide-react'
import { useState as useReactState } from 'react' // ensure React useState is available

interface Mentor {
  id: string
  name: string
  email: string
  sessions: number
  totalPayout: number
  status: 'Active' | 'Inactive'
}

export default function AdminMentorsPage() {
  const router = useRouter();
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filtered, setFiltered] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Edit modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editStatus, setEditStatus] = useState<'Active'|'Inactive'>('Active')
  const [feedback, setFeedback] = useState<{ type: 'error'|'success'; message: string }|null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All')

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => () => {});

  // Simulate fetching mentor data
  useEffect(() => {
    setLoading(true)
    setError(null)
    const dummy: Mentor[] = [
      { id: 'M1001', name: 'Alice Johnson', email: 'alice@example.com', sessions: 24, totalPayout: 96000, status: 'Active' },
      { id: 'M1002', name: 'Bob Smith', email: 'bob@example.com', sessions: 8, totalPayout: 32000, status: 'Inactive' },
      { id: 'M1003', name: 'Charlie Lee', email: 'charlie@example.com', sessions: 15, totalPayout: 60000, status: 'Active' },
      { id: 'M1004', name: 'Dana White', email: 'dana@example.com', sessions: 12, totalPayout: 48000, status: 'Active' },
    ]
    setTimeout(() => {
      setMentors(dummy)
      setFiltered(dummy)
      setLoading(false)
    }, 800)
  }, [])

  // Apply search and status filter
  useEffect(() => {
    let list = mentors
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      list = list.filter(m =>
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        m.id.toLowerCase().includes(term)
      )
    }
    if (statusFilter !== 'All') {
      list = list.filter(m => m.status === statusFilter)
    }
    setFiltered(list)
  }, [searchTerm, statusFilter, mentors])

  // Summary counts
  const totalCount = mentors.length
  const activeCount = mentors.filter(m => m.status === 'Active').length
  const inactiveCount = mentors.filter(m => m.status === 'Inactive').length

  // Export filtered list as CSV
  const handleExport = () => {
    const header = ['ID', 'Name', 'Email', 'Sessions', 'Payout', 'Status']
    const rows = filtered.map(m => [
      m.id,
      m.name,
      m.email,
      m.sessions.toString(),
      m.totalPayout.toString(),
      m.status,
    ])
    const csvContent = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.setAttribute('download', `mentors_${Date.now()}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleConfirmCancel() {
    setConfirmOpen(false);
  }
  function handleConfirmOk() {
    onConfirmAction();
    setConfirmOpen(false);
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <UsersIcon size={24} />
          <h1 className="text-2xl font-bold">Mentors</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border rounded p-1 w-full focus:ring focus:ring-indigo-200"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter size={18} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="border rounded p-1 focus:ring focus:ring-indigo-200"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('All') }}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="ml-auto inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
          >
            <DownloadCloud size={18} />
            Export CSV
          </button>
        </div>
      </header>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-indigo-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Mentors</p>
            <p className="text-xl font-semibold">{totalCount}</p>
          </div>
          <UsersIcon size={28} className="text-indigo-400" />
        </div>
        <div className="bg-green-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Active Mentors</p>
            <p className="text-xl font-semibold">{activeCount}</p>
          </div>
          <UsersIcon size={28} className="text-green-400" />
        </div>
        <div className="bg-red-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Inactive Mentors</p>
            <p className="text-xl font-semibold">{inactiveCount}</p>
          </div>
          <UsersIcon size={28} className="text-red-400" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-6">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-6">No mentors found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Sessions</th>
                <th className="p-2">Payout (₹)</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const isActive = m.status === 'Active';
                const handleEdit = (id: string) => {
                  const mentor = mentors.find(x => x.id === id)
                  if (!mentor) return setFeedback({ type:'error', message:'Mentor not found' })
                  setEditingMentor(mentor)
                  setEditName(mentor.name)
                  setEditEmail(mentor.email)
                  setEditStatus(mentor.status)
                  setModalOpen(true)
                }
                const handleToggleStatus = (id: string) => {
                  const mentor = mentors.find(m => m.id === id);
                  const action = mentor?.status === 'Active' ? 'deactivate' : 'activate';
                  setConfirmTitle('Confirm action');
                  setConfirmMessage(`Are you sure you want to ${action} mentor ${id}?`);
                  setOnConfirmAction(() => () => {
                    setMentors(prev =>
                      prev.map(m =>
                        m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m
                      )
                    );
                    setFeedback({ type: 'success', message: `Mentor ${id} status updated.` });
                    setTimeout(() => setFeedback(null), 2000);
                  });
                  setConfirmOpen(true);
                };
                const handleDelete = (id: string) => {
                  setConfirmTitle('Confirm action');
                  setConfirmMessage(`Are you sure you want to delete mentor ${id}?`);
                  setOnConfirmAction(() => () => {
                    setMentors(prev => prev.filter(m => m.id !== id));
                    setFeedback({ type: 'success', message: `Mentor ${id} deleted.` });
                    setTimeout(() => setFeedback(null), 2000);
                  });
                  setConfirmOpen(true);
                };
                return (
                  <tr
                    key={m.id}
                    onClick={() => router.push(`/admin/mentors/${m.id}`)}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="p-2 text-blue-600 font-medium">{m.id}</td>
                    <td className="p-2">{m.name}</td>
                    <td className="p-2">{m.email}</td>
                    <td className="p-2">{m.sessions}</td>
                    <td className="p-2">₹{m.totalPayout.toLocaleString()}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          m.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="p-2 flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(m.id); }} title="Edit" className="text-blue-600 hover:text-blue-800 transition">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(m.id); }} title={m.status === 'Active' ? 'Deactivate' : 'Activate'} className="text-indigo-600 hover:text-indigo-800 transition">
                        {m.status === 'Active' ? <ToggleLeft size={18} /> : <ToggleRight size={18} />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} title="Delete" className="text-red-600 hover:text-red-800 transition">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
     {/* Edit Mentor Modal */}
     {modalOpen && editingMentor && (
       <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
           <h2 className="text-xl font-semibold mb-4">Edit Mentor {editingMentor.id}</h2>
           {feedback && (
             <div className={`mb-3 p-2 text-sm rounded ${feedback.type==='error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
               {feedback.message}
             </div>
           )}
           <div className="space-y-3">
             <label className="block">
               <span className="text-gray-700">Name</span>
               <input
                 type="text"
                 value={editName}
                 onChange={e => setEditName(e.target.value)}
                 className="mt-1 block w-full border rounded p-2 focus:ring"
               />
             </label>
             <label className="block">
               <span className="text-gray-700">Email</span>
               <input
                 type="email"
                 value={editEmail}
                 onChange={e => setEditEmail(e.target.value)}
                 className="mt-1 block w-full border rounded p-2 focus:ring"
               />
             </label>
             <label className="block">
               <span className="text-gray-700">Status</span>
               <select
                 value={editStatus}
                 onChange={e => setEditStatus(e.target.value as any)}
                 className="mt-1 block w-full border rounded p-2 focus:ring"
               >
                 <option value="Active">Active</option>
                 <option value="Inactive">Inactive</option>
               </select>
             </label>
           </div>
           <div className="mt-6 flex justify-end gap-3">
             <button
               onClick={() => {
                 setModalOpen(false)
                 setFeedback(null)
               }}
               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
             >
               Cancel
             </button>
             <button
               onClick={() => {
                 if (!editName.trim() || !/\S+@\S+\.\S+/.test(editEmail)) {
                   return setFeedback({ type:'error', message:'Please enter valid name and email.' })
                 }
                 // update state
                 const updated = mentors.map(x =>
                   x.id === editingMentor.id
                     ? { ...x, name: editName.trim(), email: editEmail.trim(), status: editStatus }
                     : x
                 )
                 setMentors(updated)
                 setFiltered(updated.filter(m => {
                   const term = searchTerm.toLowerCase()
                   return m.name.toLowerCase().includes(term) || m.email.toLowerCase().includes(term) || m.id.toLowerCase().includes(term)
                 }))
                 setFeedback({ type:'success', message:'Mentor updated successfully.' })
                 setTimeout(() => {
                   setModalOpen(false)
                   setFeedback(null)
                 }, 1000)
               }}
               className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
             >
               Save
             </button>
           </div>
         </div>
       </div>
     )}
     {confirmOpen && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
           <h3 className="text-lg font-semibold mb-2">{confirmTitle}</h3>
           <p className="mb-4">{confirmMessage}</p>
           <div className="flex justify-end gap-3">
             <button
               onClick={handleConfirmCancel}
               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
             >
               Cancel
             </button>
             <button
               onClick={handleConfirmOk}
               className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
             >
               Confirm
             </button>
           </div>
         </div>
       </div>
     )}
    </div>
)
}