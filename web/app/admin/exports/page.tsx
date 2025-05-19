'use client';

import React, { useState, useEffect } from 'react';
import {
  DownloadCloud,
  FileText,
  FileSpreadsheet,
  CalendarDays,
  Filter,
  Loader2
} from 'lucide-react';

interface ExportRecord {
  id: string;
  range: { from: string; to: string };
  format: 'CSV' | 'PDF';
  createdAt: string;
}

export default function AdminExportsPage() {
  const [records, setRecords] = useState<ExportRecord[]>([]);
  const [filtered, setFiltered] = useState<ExportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [formatFilter, setFormatFilter] = useState<'All' | 'CSV' | 'PDF'>('All');
  const [creating, setCreating] = useState(false);

  // dummy initial data
  useEffect(() => {
    setLoading(true);
    setError(null);
    const dummy: ExportRecord[] = [
      {
        id: 'EXP1001',
        range: { from: '2025-01-01', to: '2025-01-31' },
        format: 'CSV',
        createdAt: '2025-02-01'
      },
      {
        id: 'EXP1002',
        range: { from: '2025-02-01', to: '2025-02-28' },
        format: 'PDF',
        createdAt: '2025-03-02'
      },
      {
        id: 'EXP1003',
        range: { from: '2025-03-01', to: '2025-03-31' },
        format: 'CSV',
        createdAt: '2025-04-01'
      },
      {
        id: 'EXP1004',
        range: { from: '2025-04-01', to: '2025-04-30' },
        format: 'PDF',
        createdAt: '2025-05-02'
      },
      {
        id: 'EXP1005',
        range: { from: '2025-05-01', to: '2025-05-10' },
        format: 'CSV',
        createdAt: '2025-05-11'
      },
    ];
    setTimeout(() => {
      setRecords(dummy);
      setLoading(false);
    }, 500);
  }, []);

  // apply filters
  useEffect(() => {
    let list = records;
    if (fromDate || toDate) {
      const from = fromDate ? new Date(fromDate) : new Date('1970-01-01');
      const to = toDate ? new Date(toDate) : new Date();
      list = list.filter(r => {
        const d = new Date(r.createdAt);
        return d >= from && d <= to;
      });
    }
    if (formatFilter !== 'All') {
      list = list.filter(r => r.format === formatFilter);
    }
    setFiltered(list);
  }, [records, fromDate, toDate, formatFilter]);

  // handle new export creation
  const handleExport = async () => {
    if (!fromDate || !toDate) {
      setError('Please select both From and To dates.');
      return;
    }
    setError(null);
    setCreating(true);
    try {
      // simulate creation delay
      const newRecord: ExportRecord = {
        id: `EXP${Date.now()}`,
        range: { from: fromDate, to: toDate },
        format: formatFilter === 'All' ? 'CSV' : formatFilter,
        createdAt: new Date().toISOString().split('T')[0]
      };
      await new Promise(res => setTimeout(res, 800));
      setRecords(prev => [newRecord, ...prev]);
      setFromDate('');
      setToDate('');
      setFormatFilter('All');
    } catch {
      setError('Failed to create export. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  // download handler
  const handleDownload = (rec: ExportRecord) => {
    const filename = `${rec.id}.${rec.format.toLowerCase()}`;
    let blob: Blob;
    if (rec.format === 'CSV') {
      const rows = [
        ['Report ID', rec.id],
        ['Date Range', `${rec.range.from} to ${rec.range.to}`],
        ['Format', rec.format],
        ['Generated On', rec.createdAt],
      ];
      const csv = rows.map(r => r.join(',')).join('\n');
      blob = new Blob([csv], { type: 'text/csv' });
    } else {
      // dummy PDF content
      const content = `Payout Export Report\n--------------------\nID: ${
        rec.id
      }\nRange: ${rec.range.from} – ${
        rec.range.to
      }\nFormat: ${rec.format}\nGenerated: ${rec.createdAt}\n\nThis is a placeholder PDF.`;
      blob = new Blob([content], { type: 'application/pdf' });
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <FileSpreadsheet size={24} />
          <h1 className="text-2xl font-bold">Exports</h1>
        </div>
      </header>

      {/* Create export form */}
      <div className="bg-indigo-50 p-4 rounded flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <label className="sr-only">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="border rounded p-1 focus:ring focus:ring-indigo-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-gray-500" />
          <label className="sr-only">To</label>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="border rounded p-1 focus:ring focus:ring-indigo-200"
          />
        </div>
        <div>
          <select
            value={formatFilter}
            onChange={e => setFormatFilter(e.target.value as any)}
            className="border rounded p-1 focus:ring focus:ring-indigo-200"
          >
            <option value="All">All Formats</option>
            <option value="CSV">CSV</option>
            <option value="PDF">PDF</option>
          </select>
        </div>
        <button
          onClick={handleExport}
          disabled={creating}
          className={`mt-2 sm:mt-0 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2`}
        >
          {creating ? <Loader2 className="animate-spin" size={18} /> : <DownloadCloud size={18} />}
          {creating ? 'Creating...' : 'Create Export'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Exports</p>
            <p className="text-xl font-semibold">{filtered.length}</p>
          </div>
          <DownloadCloud size={28} className="text-indigo-400" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-6">No exports found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Date Range</th>
                <th className="p-2">Format</th>
                <th className="p-2">Created At</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(rec => (
                <tr key={rec.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-2 font-medium">{rec.id}</td>
                  <td className="p-2">{rec.range.from} → {rec.range.to}</td>
                  <td className="p-2">{rec.format}</td>
                  <td className="p-2">{new Date(rec.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDownload(rec)}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      Download
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