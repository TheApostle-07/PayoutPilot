

'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  Search,
  Filter,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AuditLog {
  id: string;
  user: string;
  action: 'Create' | 'Update' | 'Delete';
  timestamp: string;
  details: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filtered, setFiltered] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<'All' | 'Create' | 'Update' | 'Delete'>('All');

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize);

  // Simulate fetching audit logs
  useEffect(() => {
    setLoading(true);
    setError(null);
    const dummy: AuditLog[] = Array.from({ length: 37 }, (_, i) => {
      const actions: AuditLog['action'][] = ['Create', 'Update', 'Delete'];
      const action = actions[i % 3];
      return {
        id: `AL${1000 + i + 1}`,
        user: ['Alice Johnson', 'Bob Smith', 'Charlie Lee', 'Dana White'][i % 4],
        action,
        timestamp: new Date(Date.now() - (i + 1) * 3600 * 1000).toISOString(),
        details: `${action} ${['session', 'payout', 'receipt', 'mentor'][i % 4]} record`,
      };
    });
    setLogs(dummy);
    setLoading(false);
  }, []);

  // Apply filters, search
  useEffect(() => {
    let list = logs;
    if (fromDate || toDate) {
      const from = fromDate ? new Date(fromDate) : new Date('1970-01-01');
      const to = toDate ? new Date(toDate) : new Date();
      list = list.filter(l => {
        const ts = new Date(l.timestamp);
        return ts >= from && ts <= to;
      });
    }
    if (actionFilter !== 'All') {
      list = list.filter(l => l.action === actionFilter);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        l =>
          l.user.toLowerCase().includes(term) ||
          l.details.toLowerCase().includes(term)
      );
    }
    setFiltered(list);
    setPage(1);
  }, [logs, fromDate, toDate, searchTerm, actionFilter]);

  const pageLogs = filtered.slice((page - 1) * pageSize, page * pageSize);

  const prevPage = () => setPage(p => Math.max(1, p - 1));
  const nextPage = () => setPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <Filter size={24} />
          <h1 className="text-2xl font-bold">Audit Logs</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
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
          <div className="flex items-center gap-1 border rounded p-1 flex-1 min-w-[180px]">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search user or details"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full focus:outline-none"
            />
          </div>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value as any)}
            className="border rounded p-1"
          >
            <option>All</option>
            <option value="Create">Create</option>
            <option value="Update">Update</option>
            <option value="Delete">Delete</option>
          </select>
          <button
            onClick={() => {
              setFromDate('');
              setToDate('');
              setSearchTerm('');
              setActionFilter('All');
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear
          </button>
        </div>
      </header>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-6">No audit logs found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Action</th>
                <th className="p-2">Details</th>
                <th className="p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {pageLogs.map(log => (
                <tr
                  key={log.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="p-2 font-mono">{log.id}</td>
                  <td className="p-2">{log.user}</td>
                  <td className="p-2 capitalize">{log.action}</td>
                  <td className="p-2">{log.details}</td>
                  <td className="p-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="p-1 rounded disabled:opacity-50 hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className="p-1 rounded disabled:opacity-50 hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
);
}