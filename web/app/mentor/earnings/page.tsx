'use client';

import React, { useState, useEffect } from 'react';
import { IndianRupee, CalendarDays, DownloadCloud, Filter } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface Earning {
  id: string;
  date: string;
  sessionType: string;
  duration: number; // in minutes
  rate: number; // per hour
  amount: number;
}

/**
 * Mentor Earnings Page
 */
export default function EarningsPage() {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [filtered, setFiltered] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Fetch dummy data
  useEffect(() => {
    setLoading(true);
    const dummy: Earning[] = [
      { id: 'S1001', date: '2025-05-01', sessionType: 'Live Session', duration: 60, rate: 4000, amount: 4000 },
      { id: 'S1002', date: '2025-05-03', sessionType: 'Review', duration: 45, rate: 3000, amount: 2250 },
      { id: 'S1003', date: '2025-05-05', sessionType: 'Evaluation', duration: 30, rate: 3500, amount: 1750 },
      { id: 'S1004', date: '2025-05-07', sessionType: 'Live Session', duration: 90, rate: 4000, amount: 6000 },
      // Add more entries as needed
    ];
    setTimeout(() => {
      setEarnings(dummy);
      setFiltered(dummy);
      setLoading(false);
    }, 800);
  }, []);

  // Filter by date range
  useEffect(() => {
    if (!fromDate && !toDate) {
      setFiltered(earnings);
      return;
    }
    const from = fromDate ? new Date(fromDate) : new Date('1970-01-01');
    const to = toDate ? new Date(toDate) : new Date();
    setFiltered(
      earnings.filter(e => {
        const d = new Date(e.date);
        return d >= from && d <= to;
      })
    );
  }, [fromDate, toDate, earnings]);

  // Compute totals
  const totalAmount = filtered.reduce((sum, e) => sum + e.amount, 0);
  const totalSessions = filtered.length;
  const avgRate = totalSessions ? (totalAmount / totalSessions).toFixed(2) : '0.00';

  // Export CSV
  const handleExport = () => {
    const header = ['ID', 'Date', 'Session Type', 'Duration (min)', 'Rate', 'Amount'];
    const rows = filtered.map(e => [
      e.id,
      e.date,
      e.sessionType,
      e.duration.toString(),
      e.rate.toString(),
      e.amount.toString(),
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Prepare chart data
  const chartData = earnings.map(e => ({
    date: new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    amount: e.amount,
  }));

  // Dummy breakdown by session type
  const sessionTypeBreakdown = [
    { type: 'Live Session', count: 3 },
    { type: 'Review', count: 2 },
    { type: 'Evaluation', count: 1 },
  ];
  // Dummy average duration per day
  const durationTrend = [
    { day: 'Mon', minutes: 60 },
    { day: 'Tue', minutes: 45 },
    { day: 'Wed', minutes: 30 },
    { day: 'Thu', minutes: 90 },
    { day: 'Fri', minutes: 75 },
    { day: 'Sat', minutes: 120 },
    { day: 'Sun', minutes: 80 },
  ];

  // Loader icon (inline svg, since Loader2 from lucide-react is not imported)
  function Loader2(props: { size?: number }) {
    const size = props.size ?? 24;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-loader-2 animate-spin"
      >
        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
        <path d="M22 12a10 10 0 0 1-10 10" />
      </svg>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo-600">
          <IndianRupee size={24} /> My Earnings
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Filter size={18} className="text-gray-500" />
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="border rounded p-1 focus:ring focus:ring-indigo-200"
            />
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays size={18} className="text-gray-500" />
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="border rounded p-1 focus:ring focus:ring-indigo-200"
            />
          </div>
          <button
            onClick={() => { setFromDate(''); setToDate(''); }}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="ml-auto inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
          >
            <DownloadCloud size={18} /> Export CSV
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-indigo-50 p-4 rounded-lg flex flex-col">
          <span className="text-sm text-gray-500 uppercase">Total Earnings</span>
          <span className="mt-2 text-2xl font-semibold">₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg flex flex-col">
          <span className="text-sm text-gray-500 uppercase">Sessions</span>
          <span className="mt-2 text-2xl font-semibold">{totalSessions}</span>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg flex flex-col">
          <span className="text-sm text-gray-500 uppercase">Avg per Session</span>
          <span className="mt-2 text-2xl font-semibold">₹{avgRate}</span>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Type Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Session Type Breakdown</h2>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={sessionTypeBreakdown}
                  dataKey="count"
                  nameKey="type"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={4}
                >
                  {sessionTypeBreakdown.map((entry, idx) => (
                    <Cell key={entry.type} fill={['#4F46E5','#3B82F6','#60A5FA'][idx % 3]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Session Duration Trend */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Session Duration Trend</h2>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <BarChart data={durationTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="minutes" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Earnings Trend Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Earnings Trend</h2>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin text-indigo-600">
            <Loader2 size={32} />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No earnings found for the selected range.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow p-6">
          <table className="min-w-full text-left divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-xs font-medium text-gray-500 uppercase">Session ID</th>
                <th className="p-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="p-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="p-3 text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="p-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="p-3">{e.id}</td>
                  <td className="p-3">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="p-3">{e.sessionType}</td>
                  <td className="p-3">{e.duration} min</td>
                  <td className="p-3 font-semibold">₹{e.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}