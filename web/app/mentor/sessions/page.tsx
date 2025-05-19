

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Filter,
  Search,
  CalendarDays,
} from 'lucide-react';
import { IndianRupee } from 'lucide-react';

interface Session {
  id: string;
  date: string;
  type: string;
  duration: number; // in hours
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

export default function MentorSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filtered, setFiltered] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const router = useRouter();

  // Load dummy data
  useEffect(() => {
    setLoading(true);
    setError(null);
    const dummy: Session[] = [
      { id: 'S001', date: '2025-05-01', type: 'Live Session', duration: 1.5, amount: 3000, status: 'Completed' },
      { id: 'S002', date: '2025-05-03', type: 'Review', duration: 2, amount: 2000, status: 'Pending' },
      { id: 'S003', date: '2025-05-05', type: 'Evaluation', duration: 1, amount: 1500, status: 'Completed' },
      { id: 'S004', date: '2025-05-07', type: 'Live Session', duration: 2.5, amount: 5000, status: 'Cancelled' },
    ];
    setTimeout(() => {
      setSessions(dummy);
      setFiltered(dummy);
      setLoading(false);
    }, 500);
  }, []);

  // Apply filtering and search
  useEffect(() => {
    let list = sessions;

    if (fromDate || toDate) {
      const from = fromDate ? new Date(fromDate) : new Date('1970-01-01');
      const to = toDate ? new Date(toDate) : new Date();
      list = list.filter(s => {
        const d = new Date(s.date);
        return d >= from && d <= to;
      });
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        s =>
          s.id.toLowerCase().includes(term) ||
          s.type.toLowerCase().includes(term)
      );
    }

    setFiltered(list);
  }, [sessions, fromDate, toDate, searchTerm]);

  // Compute summaries
  const totalCount = filtered.length;
  const totalDuration = filtered.reduce((sum, s) => sum + s.duration, 0);
  const totalEarnings = filtered.reduce((sum, s) => sum + s.amount, 0);

  const clearFilters = () => {
    setFromDate('');
    setToDate('');
    setSearchTerm('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      {/* Header & Filters */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <CalendarDays size={24} />
          <h1 className="text-2xl font-bold">My Sessions</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <Filter size={18} className="text-gray-500" />
            <label className="sr-only">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="border rounded p-1 focus:ring focus:ring-indigo-200"
            />
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays size={18} className="text-gray-500" />
            <label className="sr-only">To</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="border rounded p-1 focus:ring focus:ring-indigo-200"
            />
          </div>
          <div className="flex items-center gap-1 flex-1 sm:flex-none">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by ID or type"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border rounded p-1 w-full focus:ring focus:ring-indigo-200"
            />
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-indigo-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Sessions</p>
            <p className="text-xl font-semibold">{totalCount}</p>
          </div>
          <CalendarDays size={28} className="text-indigo-400" />
        </div>
        <div className="bg-indigo-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Duration (hrs)</p>
            <p className="text-xl font-semibold">{totalDuration}</p>
          </div>
          <CalendarDays size={28} className="text-indigo-400" />
        </div>
        <div className="bg-indigo-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-xl font-semibold">₹{totalEarnings.toLocaleString()}</p>
          </div>
          <IndianRupee size={28} className="text-indigo-400" />
        </div>
      </div>

      {/* Sessions Table */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-6">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-6">No sessions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Date</th>
                <th className="p-2">Type</th>
                <th className="p-2">Duration (hrs)</th>
                <th className="p-2">Earnings</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr
                  key={s.id}
                  onClick={() => router.push(`/mentor/sessions/${s.id}`)}
                  className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-2">{s.id}</td>
                  <td className="p-2">{new Date(s.date).toLocaleDateString()}</td>
                  <td className="p-2">{s.type}</td>
                  <td className="p-2">{s.duration}</td>
                  <td className="p-2">₹{s.amount.toLocaleString()}</td>
                  <td className="p-2">
                    <span
                      className={`
                        px-2 py-0.5 rounded-full text-xs font-medium
                        ${s.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                        ${s.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${s.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                      `}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}