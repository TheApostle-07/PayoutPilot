

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import {
  Loader2,
  FileText,
  CalendarDays,
  DownloadCloud,
  Filter,
  Search,
} from 'lucide-react'

interface Receipt {
  id: string
  date: string
  amount: number
  status: 'Pending' | 'Sent' | 'Viewed'
}

export default function MentorReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [filtered, setFiltered] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const router = useRouter();

  // simulate fetching data
  useEffect(() => {
    setLoading(true)
    setError(null)
    const dummy: Receipt[] = [
      { id: 'RC2001', date: '2025-05-01', amount: 2500, status: 'Sent' },
      { id: 'RC2002', date: '2025-05-05', amount: 3000, status: 'Viewed' },
      { id: 'RC2003', date: '2025-05-10', amount: 2800, status: 'Pending' },
    ]
    const timeout = setTimeout(() => {
      setReceipts(dummy)
      setFiltered(dummy)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timeout)
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
        r.id.toLowerCase().includes(term)
      )
    }
    setFiltered(list)
  }, [fromDate, toDate, searchTerm, receipts])

  // handle CSV export
  const exportCSV = () => {
    const header = ['ID','Date','Amount','Status']
    const rows = filtered.map(r => [r.id, r.date, r.amount.toString(), r.status])
    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `my_receipts_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <FileText size={24} />
          <h1 className="text-2xl font-bold">My Receipts</h1>
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
              placeholder="Search by ID"
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
            onClick={exportCSV}
            disabled={loading}
            className="ml-auto inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
          >
            <DownloadCloud size={18} />
            Export CSV
          </button>
        </div>
      </header>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-6">No receipts found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Date</th>
                <th className="p-2">Amount (₹)</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr
                  key={r.id}
                  onClick={() => router.push(`/mentor/receipts/${r.id}`)}
                  className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-2">
                    <Link href={`/mentor/receipts/${r.id}`} className="text-blue-600 hover:underline">
                      {r.id}
                    </Link>
                  </td>
                  <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="p-2">₹{r.amount.toLocaleString()}</td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.status === 'Sent' ? 'bg-green-100 text-green-800' :
                      r.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
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