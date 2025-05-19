'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

// Dummy data for metrics
const metrics = {
  sessions: 128,
  payouts: 45230,
  mentors: 24,
  avgPayout: (45230 / 128).toFixed(2),
  totalSessionsHours: 96, // placeholder total hours
};

// Dummy data for weekly payout trend
const payoutTrend = [
  { day: 'Mon', amount: 5000 },
  { day: 'Tue', amount: 6000 },
  { day: 'Wed', amount: 5500 },
  { day: 'Thu', amount: 7000 },
  { day: 'Fri', amount: 6500 },
  { day: 'Sat', amount: 8000 },
  { day: 'Sun', amount: 7500 },
];

// Dummy data for recent sessions
const recentSessions = [
  { id: '1', mentor: 'Alice Johnson', date: '2025-05-12', type: 'Live Session', amount: 2000, status: 'Paid' },
  { id: '2', mentor: 'Bob Smith', date: '2025-05-11', type: 'Review', amount: 1500, status: 'Pending' },
  { id: '3', mentor: 'Carol Lee', date: '2025-05-10', type: 'Evaluation', amount: 1800, status: 'Under Review' },
];

// Dummy data for weekly sessions trend
const sessionsTrend = [
  { day: 'Mon', count: 18 },
  { day: 'Tue', count: 22 },
  { day: 'Wed', count: 20 },
  { day: 'Thu', count: 25 },
  { day: 'Fri', count: 23 },
  { day: 'Sat', count: 28 },
  { day: 'Sun', count: 26 },
];

// Dummy breakdown by session type
const sessionTypeBreakdown = [
  { type: 'Live', count: 45 },
  { type: 'Review', count: 30 },
  { type: 'Evaluation', count: 20 },
  { type: 'Recording', count: 33 },
];

// Dummy status distribution for sessions
const statusDistribution = [
  { name: 'Paid', value: 80 },
  { name: 'Pending', value: 25 },
  { name: 'Under Review', value: 23 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Sessions This Week</h3>
          <p className="mt-4 text-3xl font-bold text-gray-800">{metrics.sessions}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Total Payouts</h3>
          <p className="mt-4 text-3xl font-bold text-gray-800">₹{metrics.payouts.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Active Mentors</h3>
          <p className="mt-4 text-3xl font-bold text-gray-800">{metrics.mentors}</p>
        </div>
        {/* Average Payout per Session */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Avg Payout Per Session</h3>
          <p className="mt-4 text-3xl font-bold text-gray-800">₹{metrics.avgPayout}</p>
        </div>
        {/* Total Session Hours */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Session Hours This Week</h3>
          <p className="mt-4 text-3xl font-bold text-gray-800">{metrics.totalSessionsHours}h</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Sessions Trend (Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Weekly Session Trend</h3>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <BarChart data={sessionsTrend} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Session Type Breakdown (Pie Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Session Type Breakdown</h3>
          <div className="w-full h-72 flex items-center justify-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={sessionTypeBreakdown}
                  dataKey="count"
                  nameKey="type"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {sessionTypeBreakdown.map((entry, index) => (
                    <Cell key={entry.type} fill={['#4F46E5', '#3B82F6', '#60A5FA', '#93C5FD'][index % 4]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Payout Trend */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Weekly Payout Trend</h3>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <LineChart data={payoutTrend} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Sessions</h3>
        <table className="min-w-full text-left divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Mentor</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{session.mentor}</td>
                  <td className="px-4 py-3 text-gray-800">{session.date}</td>
                  <td className="px-4 py-3 text-gray-800">{session.type}</td>
                  <td className="px-4 py-3 text-gray-800">₹{session.amount}</td>
                  <td
                    className={`px-4 py-3 font-medium ${
                      session.status === 'Paid'
                        ? 'text-green-600'
                        : session.status === 'Pending'
                        ? 'text-yellow-600'
                        : 'text-indigo-600'
                    }`}
                  >
                    {session.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No sessions available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
