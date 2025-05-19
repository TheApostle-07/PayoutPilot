'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { CalendarDays, UploadCloud, Search, IndianRupee } from 'lucide-react'

type Session = {
  id: string
  mentorName: string
  date: Date
  type: 'Live' | 'Recording' | 'Evaluation'
  durationMinutes: number
  ratePerHour: number
}

export default function AdminSessionsPage() {
  // Dummy data
  const dummyData: Session[] = [
    { id: '1', mentorName: 'Alice Johnson', date: new Date(2025, 4, 10, 14, 0), type: 'Live', durationMinutes: 60, ratePerHour: 4000 },
    { id: '2', mentorName: 'Bob Smith', date: new Date(2025, 4, 11, 16, 30), type: 'Evaluation', durationMinutes: 45, ratePerHour: 3500 },
    { id: '3', mentorName: 'Carol Nguyen', date: new Date(2025, 4, 12, 10, 0), type: 'Recording', durationMinutes: 30, ratePerHour: 3000 },
    { id: '4', mentorName: 'David Lee', date: new Date(2025, 4, 13, 9, 15), type: 'Live', durationMinutes: 90, ratePerHour: 4500 },
  ]

  const [filter, setFilter] = useState<'7' | '15' | '30' | 'custom'>('7')
  const [customRange, setCustomRange] = useState({ from: '', to: '' })
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = useMemo(() => {
    const today = new Date()
    let sessions = [...dummyData]

    // Date-range filter
    if (filter !== 'custom') {
      const days = parseInt(filter, 10)
      const cutoff = new Date(today)
      cutoff.setDate(today.getDate() - days)
      sessions = sessions.filter(s => s.date >= cutoff && s.date <= today)
    } else if (customRange.from && customRange.to) {
      const from = new Date(customRange.from)
      const to = new Date(customRange.to)
      sessions = sessions.filter(s => s.date >= from && s.date <= to)
    }

    // Search filter
    if (searchTerm.trim()) {
      sessions = sessions.filter(s =>
        s.mentorName.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    }

    // Sort by most recent
    return sessions.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [filter, customRange, searchTerm, dummyData])

  // Totals
  const totalSessions = filtered.length
  const totalAmount = filtered.reduce(
    (sum, s) => sum + (s.durationMinutes / 60) * s.ratePerHour,
    0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sessions</h1>
        <Link
          href="/admin/sessions/upload"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          <UploadCloud size={18} /> Upload CSV
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by mentor..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        {/* Date Range */}
        <div className="flex items-center gap-2">
          <CalendarDays size={20} className="text-gray-500" />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as any)}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="7">Last 7 days</option>
            <option value="15">Last 15 days</option>
            <option value="30">Last 30 days</option>
            <option value="custom">Custom range</option>
          </select>
          {filter === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customRange.from}
                onChange={e => setCustomRange(prev => ({ ...prev, from: e.target.value }))}
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={customRange.to}
                onChange={e => setCustomRange(prev => ({ ...prev, to: e.target.value }))}
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No sessions found.</p>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Mentor</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-right">Duration</th>
                <th className="px-4 py-2 text-right">Rate/hr</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{s.mentorName}</td>
                  <td className="px-4 py-2">
                    {format(s.date, 'dd MMM yyyy, HH:mm')}
                  </td>
                  <td className="px-4 py-2">{s.type}</td>
                  <td className="px-4 py-2 text-right">
                    {s.durationMinutes} min
                  </td>
                  <td className="px-4 py-2 text-right">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(s.ratePerHour)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format((s.durationMinutes / 60) * s.ratePerHour)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-lg shadow flex items-center">
          <CalendarDays size={32} className="text-indigo-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Total Sessions</p>
            <p className="text-2xl font-bold text-gray-800">{totalSessions}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow flex items-center">
          <IndianRupee size={32} className="text-green-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Total Payout</p>
            <p className="text-2xl font-bold text-gray-800">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}