'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  FileText,
  IndianRupee,
  CalendarDays,
  DownloadCloud,
  Filter,
  Search,
} from 'lucide-react'

interface Receipt {
  id: string
  mentor: string
  date: string
  amount: number
  status: 'Pending' | 'Sent' | 'Viewed'
}

export default function AdminReceiptsPage() {
  const router = useRouter()
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [filtered, setFiltered] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // simulate fetching data
  useEffect(() => {
    setLoading(true)
    setError(null)
    const dummy: Receipt[] = [
      { id: 'RC1001', mentor: 'Alice Johnson', date: '2025-04-20', amount: 4000, status: 'Sent' },
      { id: 'RC1002', mentor: 'Bob Smith', date: '2025-04-22', amount: 3000, status: 'Viewed' },
      { id: 'RC1003', mentor: 'Charlie Lee', date: '2025-04-25', amount: 3500, status: 'Pending' },
      { id: 'RC1004', mentor: 'Dana White', date: '2025-05-02', amount: 4500, status: 'Sent' },
    ]
    setTimeout(() => {
      setReceipts(dummy)
      setFiltered(dummy)
      setLoading(false)
    }, 600)
  }, [])

  // apply filters and search
  useEffect(() => {
    let list = receipts
    if (fromDate || toDate) {
      const from = fromDate ? new Date(fromDate) : new Date('1970-01-01')
      const to = toDate ? new Date(toDate) : new Date()
      list = list.filter(r => {
        const d = new Date(r.date)
        return d >= from && d <= to
      })
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      list = list.filter(r =>
        r.id.toLowerCase().includes(term) ||
        r.mentor.toLowerCase().includes(term)
      )
    }
    setFiltered(list)
  }, [fromDate, toDate, searchTerm, receipts])

  // summary
  const totalAmount = filtered.reduce((sum, r) => sum + r.amount, 0)
  const totalCount = filtered.length

  // export CSV
  const handleExport = () => {
    const header = ['ID','Mentor','Date','Amount','Status']
    const rows = filtered.map(r => [r.id, r.mentor, r.date, r.amount.toString(), r.status])
    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipts_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <FileText size={24} />
          <h1 className="text-2xl font-bold">Receipts</h1>
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
          <div className="flex items-center gap-1 flex-1 sm:flex-none">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by ID or mentor"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border rounded p-1 w-full focus:ring focus:ring-indigo-200"
            />
          </div>
          <button
            onClick={() => { setFromDate(''); setToDate(''); setSearchTerm('') }}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Receipts</p>
            <p className="text-xl font-semibold">{totalCount}</p>
          </div>
          <FileText size={28} className="text-indigo-400" />
        </div>
        <div className="bg-indigo-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-xl font-semibold">₹{totalAmount.toLocaleString()}</p>
          </div>
          <IndianRupee size={28} className="text-indigo-400" />
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
        <div className="text-gray-500 text-center py-6">No receipts found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Mentor</th>
                <th className="p-2">Date</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr
                  key={r.id}
                  onClick={() => router.push(`/admin/receipts/${r.id}`)}
                  className="cursor-pointer border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="p-2 text-blue-600">
                    {r.id}
                  </td>
                  <td className="p-2">{r.mentor}</td>
                  <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="p-2">₹{r.amount.toLocaleString()}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.status === 'Sent'
                          ? 'bg-green-100 text-green-800'
                          : r.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}