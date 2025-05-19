'use client';

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, IndianRupee, ArrowLeft, Download, FileText } from 'lucide-react'
import { jsPDF } from 'jspdf'

interface Session {
  id: string
  date: string
  type: string
  duration: number // in minutes
  rate: number // per hour
  amount: number
}

interface Charge {
  label: string
  amount: number
}

interface Payout {
  id: string
  mentorName: string
  period: { start: string; end: string }
  sessions: Session[]
  charges: Charge[]
  total: number
}

async function getPayout(payoutId: string): Promise<Payout | null> {
  // TODO: replace with real data fetching
  return {
    id: payoutId,
    mentorName: 'Rufus Bright',
    period: { start: '2025-05-01', end: '2025-05-15' },
    sessions: [
      { id: 's1', date: '2025-05-02', type: 'Live', duration: 60, rate: 4000, amount: 4000 },
      { id: 's2', date: '2025-05-05', type: 'Review', duration: 30, rate: 4000, amount: 2000 },
    ],
    charges: [
      { label: 'Platform Fee', amount: 500 },
      { label: 'GST (18%)', amount: 900 },
    ],
    total: 4600,
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function PayoutPage({
  params,
}: {
  params: { payoutId: string }
}) {
  const router = useRouter()
  const [payout, setPayout] = useState<Payout | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPayout(params.payoutId)
      .then(p => {
        if (!p) throw new Error('Payout not found')
        setPayout(p)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [params.payoutId])

  if (loading) return <div className="p-6 text-center"><Loader2 className="animate-spin mx-auto" size={32}/>Loading payout...</div>
  if (error) return <div className="text-red-600 p-6">{error}</div>
  if (!payout) return <div className="text-gray-600 p-6">Payout not found.</div>

  const gross = payout.sessions.reduce((sum, s) => sum + s.amount, 0)
  const totalCharges = payout.charges.reduce((sum, c) => sum + c.amount, 0)
  const net = gross - totalCharges

  // Generate and download a PDF receipt
  function handleDownloadPDF() {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(`Receipt: ${payout.id}`, 14, 20)
    doc.setFontSize(12)
    doc.text(`Mentor: ${payout.mentorName}`, 14, 30)
    doc.text(`Period: ${formatDate(payout.period.start)} – ${formatDate(payout.period.end)}`, 14, 36)

    // Table header
    let y = 50
    doc.setFontSize(11)
    doc.text('Date', 14, y)
    doc.text('Type', 50, y)
    doc.text('Duration', 90, y)
    doc.text('Rate', 130, y)
    doc.text('Amount', 170, y)
    y += 6

    // Sessions rows
    payout.sessions.forEach(s => {
      doc.text(formatDate(s.date), 14, y)
      doc.text(s.type, 50, y)
      doc.text(`${s.duration} mins`, 90, y)
      doc.text(`₹${s.rate.toLocaleString()}`, 130, y)
      doc.text(`₹${s.amount.toLocaleString()}`, 170, y)
      y += 6
    })

    // Charges & taxes
    y += 10
    doc.setFontSize(12)
    doc.text('Charges & Taxes', 14, y)
    y += 6
    payout.charges.forEach(c => {
      doc.setFontSize(11)
      doc.text(c.label, 14, y)
      doc.text(`₹${c.amount.toLocaleString()}`, 130, y)
      y += 6
    })

    // Net total
    y += 10
    doc.setFontSize(14)
    doc.text(`Net Payout: ₹${net.toLocaleString()}`, 14, y)

    doc.save(`receipt_${payout.id}.pdf`)
  }

  return (
    <div className="space-y-6 p-6">
      <Link
        href="/admin/payouts"
        className="inline-flex items-center text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to All Payouts
      </Link>

      <section className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">Payout Details</h1>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <span className="block text-sm text-gray-500">Payout ID</span>
            <span className="font-medium">{payout.id}</span>
          </div>
          <div>
            <span className="block text-sm text-gray-500">Mentor</span>
            <span className="font-medium">{payout.mentorName}</span>
          </div>
          <div>
            <span className="block text-sm text-gray-500">Period</span>
            <span className="font-medium">
              {formatDate(payout.period.start)} – {formatDate(payout.period.end)}
            </span>
          </div>
          <div>
            <span className="block text-sm text-gray-500">Net Payout</span>
            <span className="text-xl font-bold flex items-center">
              <IndianRupee size={18} className="mr-1" />
              {net.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Session breakdown */}
        <div className="mt-6">
          <h2 className="text-xl font-medium mb-2">Session Breakdown</h2>
          {payout.sessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Date</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Duration</th>
                    <th className="p-2">Rate</th>
                    <th className="p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payout.sessions.map((s) => (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="p-2">{formatDate(s.date)}</td>
                      <td className="p-2">{s.type}</td>
                      <td className="p-2">{s.duration} mins</td>
                      <td className="p-2 flex items-center">
                        <IndianRupee size={14} className="mr-1" />
                        {s.rate.toLocaleString()}
                      </td>
                      <td className="p-2 text-right flex items-center justify-end">
                        <IndianRupee size={14} className="mr-1" />
                        {s.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No sessions recorded in this period.</p>
          )}
        </div>

        {/* Charges */}
        <div className="mt-6">
          <h2 className="text-xl font-medium mb-2">Charges & Taxes</h2>
          {payout.charges.length > 0 ? (
            <ul className="space-y-1">
              {payout.charges.map((c, i) => (
                <li key={i} className="flex justify-between text-gray-700">
                  <span>{c.label}</span>
                  <span className="flex items-center justify-end">
                    <IndianRupee size={14} className="mr-1" />
                    {c.amount.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No additional charges.</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Download size={16} className="mr-2" />
            Download PDF
          </button>
          <Link
            href={`/admin/receipts/${payout.id}`}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <FileText size={16} className="mr-2" />
            View Invoice
          </Link>
        </div>
      </section>
    </div>
  )
}