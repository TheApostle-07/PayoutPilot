'use client';

import React, { useState, useEffect } from 'react';
import { Zap, CalendarDays, Loader2, CheckCircle, X } from 'lucide-react';

interface Session {
  id: string;
  mentor: string;
  date: string;
  duration: number;    // in hours
  rate: number;        // ₹ per hour
  coefficient: number; // breakdown factor
}

export default function SimulationPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filtered, setFiltered] = useState<Session[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load dummy data
  useEffect(() => {
    setLoading(true);
    const dummy: Session[] = [
      { id: 'S1001', mentor: 'Alice Johnson',   date: '2025-05-01', duration: 1.5, rate: 4000, coefficient: 1 },
      { id: 'S1002', mentor: 'Bob Smith',       date: '2025-05-03', duration: 2,   rate: 3500, coefficient: 1 },
      { id: 'S1003', mentor: 'Charlie Lee',     date: '2025-05-05', duration: 0.75,rate: 4500, coefficient: 1 },
      { id: 'S1004', mentor: 'Dana White',      date: '2025-05-07', duration: 1,   rate: 3000, coefficient: 1 },
      // …more if needed
    ];
    setTimeout(() => {
      setSessions(dummy);
      setFiltered(dummy);
      setLoading(false);
    }, 600);
  }, []);

  // Re-filter on date change
  useEffect(() => {
    let list = sessions;
    if (fromDate) {
      const f = new Date(fromDate);
      list = list.filter(s => new Date(s.date) >= f);
    }
    if (toDate) {
      const t = new Date(toDate);
      list = list.filter(s => new Date(s.date) <= t);
    }
    setFiltered(list);
  }, [fromDate, toDate, sessions]);

  // Kick off “simulation” (just shows loader here)
  const runSimulation = () => {
    setSuccess(false);
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setSuccess(true);
    }, 800);
  };

  // Summaries
  const totalSessions = filtered.length;
  const totalPayout = filtered.reduce(
    (sum, s) => sum + s.duration * s.rate * s.coefficient,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Header & Controls */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <Zap size={24} />
          <h1 className="text-2xl font-bold">Simulation</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Date filters */}
          <div className="flex items-center gap-1 border rounded p-1">
            <CalendarDays size={18} className="text-gray-500" />
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1 border rounded p-1">
            <CalendarDays size={18} className="text-gray-500" />
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="focus:outline-none"
            />
          </div>
          <button
            onClick={() => { setFromDate(''); setToDate(''); }}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear
          </button>
          <button
            onClick={runSimulation}
            disabled={loading || running}
            className={`
              ml-auto inline-flex items-center gap-2 px-4 py-2 rounded font-medium text-white
              ${loading || running
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'}
              transition
            `}
          >
            {running ? <Loader2 className="animate-spin" size={18} /> : 'Run Simulation'}
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Sessions</p>
            <p className="text-xl font-semibold">{totalSessions}</p>
          </div>
          <CalendarDays size={28} className="text-indigo-400" />
        </div>
        <div className="bg-indigo-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Projected Payout</p>
            <p className="text-xl font-semibold">
              ₹{totalPayout.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
          <Zap size={28} className="text-indigo-400" />
        </div>
      </div>

      {/* Table / Loading / Empty States */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-6">No sessions found for the selected range.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Session ID</th>
                <th className="p-2">Mentor</th>
                <th className="p-2">Date</th>
                <th className="p-2">Duration (hrs)</th>
                <th className="p-2">Rate (₹/hr)</th>
                <th className="p-2">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr
                  key={s.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="p-2 font-mono">{s.id}</td>
                  <td className="p-2">{s.mentor}</td>
                  <td className="p-2">{new Date(s.date).toLocaleDateString()}</td>
                  <td className="p-2">{s.duration}</td>
                  <td className="p-2">₹{s.rate.toLocaleString()}</td>
                  <td className="p-2 font-semibold">
                    ₹{(s.duration * s.rate * s.coefficient).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 backdrop-blur-lg">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center relative">
            <button
              onClick={() => setSuccess(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Simulation Successful</h2>
            <p className="text-gray-600 mb-6 flex items-center justify-center gap-2">
              
              All payouts have been recalculated&nbsp;and&nbsp;re‑checked.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}