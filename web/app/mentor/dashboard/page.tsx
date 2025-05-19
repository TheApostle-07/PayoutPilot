'use client';

import React, { useEffect, useState } from 'react';
import { IndianRupee, CalendarDays, Loader2 } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Dummy data for mentor dashboard
interface Session {
  id: string;
  date: string;
  type: string;
  duration: number; // in hours
  earnings: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

// Weekly metrics data
const weeklySessions = 14;
const weeklyEarnings = 28000;
const totalHours = 21;

// Payout trend (per day)
const payoutTrend = [
  { day: 'Mon', amount: 3000 },
  { day: 'Tue', amount: 3500 },
  { day: 'Wed', amount: 2500 },
  { day: 'Thu', amount: 4000 },
  { day: 'Fri', amount: 3000 },
  { day: 'Sat', amount: 5000 },
  { day: 'Sun', amount: 4000 },
];

// Session type breakdown
const sessionTypeBreakdown = [
  { type: 'Live', count: 8 },
  { type: 'Review', count: 4 },
  { type: 'Evaluation', count: 2 },
];

// Weekly session count
const sessionCountTrend = [
  { day: 'Mon', count: 2 },
  { day: 'Tue', count: 3 },
  { day: 'Wed', count: 1 },
  { day: 'Thu', count: 4 },
  { day: 'Fri', count: 2 },
  { day: 'Sat', count: 1 },
  { day: 'Sun', count: 1 },
];

// Dummy recent sessions
const dummySessions: Session[] = [
  { id: 'S1001', date: '2025-05-12', type: 'Live', duration: 2, earnings: 4000, status: 'Completed' },
  { id: 'S1002', date: '2025-05-11', type: 'Review', duration: 1, earnings: 1500, status: 'Completed' },
  { id: 'S1003', date: '2025-05-10', type: 'Evaluation', duration: 1.5, earnings: 2250, status: 'Pending' },
  { id: 'S1004', date: '2025-05-09', type: 'Live', duration: 2, earnings: 4000, status: 'Completed' },
];

export default function MentorDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate fetch
    setTimeout(() => {
      setSessions(dummySessions);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase flex items-center gap-2">
            <CalendarDays size={16} /> Sessions This Week
          </h3>
          <p className="mt-4 text-3xl font-bold text-gray-800">{weeklySessions}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase flex items-center gap-2">
            <IndianRupee size={16} /> Earnings This Week
          </h3>
          <p className="mt-4 text-3xl font-bold text-gray-800">₹{weeklyEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase flex items-center gap-2">
            <CalendarDays size={16} /> Hours This Week
          </h3>
          <p className="mt-4 text-3xl font-bold text-gray-800">{totalHours}h</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payout Trend */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Weekly Payout Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={payoutTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Session Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Session Type Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sessionTypeBreakdown}
                  dataKey="count"
                  nameKey="type"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {sessionTypeBreakdown.map((entry, idx) => (
                    <Cell key={entry.type} fill={['#4F46E5', '#3B82F6', '#60A5FA'][idx % 3]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Sessions</h3>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No sessions recorded this week.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Earnings</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{new Date(s.date).toLocaleDateString()}</td>
                    <td className="p-3">{s.type}</td>
                    <td className="p-3">{s.duration}h</td>
                    <td className="p-3">₹{s.earnings.toLocaleString()}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          s.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : s.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
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
    </div>
  );
}
