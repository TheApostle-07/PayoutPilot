'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  IndianRupee,
  CalendarDays,
  DownloadCloud,
  Filter,
} from 'lucide-react';

interface Payout {
  id: string;
  mentor: string;
  date: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Under Review';
}

export default function PayoutsPage() {
  const router = useRouter();

  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [filtered, setFiltered] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // 1) Load dummy data
  useEffect(() => {
    setLoading(true);
    setError(null);
    const dummy: Payout[] = [
      { id: 'PO1001', mentor: 'Alice Johnson', date: '2025-04-20', amount: 4000, status: 'Paid' },
      { id: 'PO1002', mentor: 'Bob Smith',   date: '2025-04-22', amount: 3000, status: 'Under Review' },
      { id: 'PO1003', mentor: 'Charlie Lee', date: '2025-04-25', amount: 3500, status: 'Paid' },
      { id: 'PO1004', mentor: 'Dana White',  date: '2025-05-02', amount: 4500, status: 'Pending' },
    ];
    setTimeout(() => {
      setPayouts(dummy);
      setFiltered(dummy);
      setLoading(false);
    }, 800);
  }, []);

  // 2) Filter by date
  useEffect(() => {
    if (!fromDate && !toDate) {
      setFiltered(payouts);
      return;
    }
    const from = fromDate ? new Date(fromDate) : new Date('1970-01-01');
    const to   = toDate   ? new Date(toDate)   : new Date();
    setFiltered(
      payouts.filter(p => {
        const d = new Date(p.date);
        return d >= from && d <= to;
      })
    );
  }, [fromDate, toDate, payouts]);

  // 3) Totals
  const totalAmount = filtered.reduce((sum, p) => sum + p.amount, 0);
  const totalCount  = filtered.length;

  // 4) CSV export
  const handleExport = () => {
    const header = ['ID','Mentor','Date','Amount','Status'];
    const rows   = filtered.map(p => [p.id, p.mentor, p.date, p.amount.toString(), p.status]);
    const csv    = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob   = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement('a');
    a.href       = url;
    a.download   = `payouts_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateStatus = (id: string, status: Payout['status']) => {
    const updated = payouts.map(p =>
      p.id === id ? { ...p, status } : p
    );
    setPayouts(updated);
    recalcFiltered(updated);
  };

  const deletePayout = (id: string) => {
    const updated = payouts.filter(p => p.id !== id);
    setPayouts(updated);
    recalcFiltered(updated);
  };

  // ——— Helpers ———
  const recalcFiltered = (list: Payout[]) => {
    if (!fromDate && !toDate) {
      setFiltered(list);
      return;
    }
    const from = fromDate ? new Date(fromDate) : new Date('1970-01-01');
    const to   = toDate   ? new Date(toDate)   : new Date();
    setFiltered(
      list.filter(p => {
        const d = new Date(p.date);
        return d >= from && d <= to;
      })
    );
  };

  // 5) Navigate to detail
  const goToDetail = (id: string) => {
    router.push(`/admin/payouts/${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Header & Filters */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <IndianRupee size={24} />
          <h1 className="text-2xl font-bold">Payouts</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Payouts</p>
            <p className="text-xl font-semibold">
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>
          <IndianRupee size={28} className="text-indigo-400" />
        </div>
        <div className="bg-indigo-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Transactions</p>
            <p className="text-xl font-semibold">{totalCount}</p>
          </div>
          <CalendarDays size={28} className="text-indigo-400" />
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
        <div className="text-gray-500 text-center py-6">No payouts found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Mentor</th>
                <th className="p-2">Date</th>
                <th className="p-2">Amount (₹)</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => goToDetail(p.id)}
                  className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.mentor}</td>
                  <td className="p-2">
                    {new Date(p.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">₹{p.amount.toLocaleString()}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : p.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-2 space-x-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(p.id, 'Paid');
                      }}
                      disabled={p.status === 'Paid'}
                      className="px-2 py-0.5 text-xs rounded bg-green-600 text-white disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(p.id, 'Under Review');
                      }}
                      className="px-2 py-0.5 text-xs rounded bg-yellow-600 text-white"
                    >
                      Reject
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePayout(p.id);
                      }}
                      className="px-2 py-0.5 text-xs rounded bg-red-600 text-white"
                    >
                      Delete
                    </button>
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