'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  IndianRupee,
  FileText,
  DownloadCloud,
  CalendarDays,
  ArrowLeft,
} from 'lucide-react'
import { jsPDF } from 'jspdf';

interface ReceiptItem {
  description: string
  hours: number
  rate: number
  amount: number
}

interface ReceiptData {
  id: string
  mentor: string
  date: string
  items: ReceiptItem[]
  subtotal: number
  tax: number
  total: number
  status: 'Pending' | 'Paid' | 'Under Review'
}

// Dummy data lookup
const DUMMY_RECEIPTS: Record<string, ReceiptData> = {
  RC1001: {
    id: 'RC1001',
    mentor: 'Alice Johnson',
    date: '2025-04-20',
    items: [
      { description: 'Live Session', hours: 1, rate: 4000, amount: 4000 },
      { description: 'Review Recording', hours: 0.5, rate: 2000, amount: 1000 },
    ],
    subtotal: 5000,
    tax: 250,
    total: 5250,
    status: 'Paid',
  },
  RC1002: {
    id: 'RC1002',
    mentor: 'Bob Smith',
    date: '2025-05-02',
    items: [
      { description: 'Workshop', hours: 2, rate: 3000, amount: 6000 },
    ],
    subtotal: 6000,
    tax: 300,
    total: 6300,
    status: 'Pending',
  },
  RC1003: {
    id: 'RC1003',
    mentor: 'Catherine Lee',
    date: '2025-05-10',
    items: [
      { description: 'Mentor Session', hours: 1.5, rate: 3500, amount: 5250 },
      { description: 'Q&A Support', hours: 1, rate: 1500, amount: 1500 },
    ],
    subtotal: 6750,
    tax: 338,
    total: 7088,
    status: 'Under Review',
  },
  RC1004: {
    id: 'RC1004',
    mentor: 'Daniel Kim',
    date: '2025-05-15',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    status: 'Pending',
  },
};

export default function ReceiptDetailPage() {
  const { receiptId } = useParams() as { receiptId: string }
  const router = useRouter()
  const receipt = DUMMY_RECEIPTS[receiptId] || {
    id: receiptId,
    mentor: 'Unknown Mentor',
    date: new Date().toISOString(),
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    status: 'Pending',
  }

  const dateObj = new Date(receipt.date)
  const formattedDate = `${dateObj.toLocaleString('en-US', { month: 'long' })} ${dateObj.getDate()}, ${dateObj.getFullYear()}`

  const handleDownload = () => {
    const doc = new jsPDF();
    // Title
    doc.setFontSize(16);
    doc.text(`Receipt #${receipt.id}`, 14, 20);
    // Meta
    doc.setFontSize(12);
    doc.text(`Mentor: ${receipt.mentor}`, 14, 30);
    doc.text(`Date: ${formattedDate}`, 14, 38);
    doc.text(`Status: ${receipt.status}`, 14, 46);
    // Table headers
    const startY = 60;
    doc.setFontSize(11);
    doc.text('Description', 14, startY);
    doc.text('Hours', 80, startY);
    doc.text('Rate (₹)', 110, startY);
    doc.text('Amount (₹)', 150, startY);
    // Table rows
    let y = startY + 8;
    if (receipt.items.length) {
      receipt.items.forEach(item => {
        doc.text(item.description, 14, y);
        doc.text(item.hours.toString(), 80, y);
        doc.text(item.rate.toLocaleString(), 110, y);
        doc.text(item.amount.toLocaleString(), 150, y);
        y += 8;
      });
    } else {
      doc.text('No items available', 14, y);
      y += 8;
    }
    // Summary
    y += 8;
    doc.setFontSize(12);
    doc.text(`Subtotal: ₹${receipt.subtotal.toLocaleString()}`, 14, y);
    y += 8;
    doc.text(`Tax: ₹${receipt.tax.toLocaleString()}`, 14, y);
    y += 8;
    doc.setFontSize(14);
    doc.text(`Total: ₹${receipt.total.toLocaleString()}`, 14, y);
    // Save PDF
    doc.save(`receipt_${receipt.id}.pdf`);
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-indigo-600">
          <FileText size={24} />
          <h1 className="text-2xl font-bold">Receipt #{receipt.id}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            <DownloadCloud size={18} /> Download PDF
          </button>
        </div>
      </header>

      <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 text-sm">Mentor</p>
          <p className="font-medium text-gray-800">{receipt.mentor}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Date</p>
          <p className="font-medium text-gray-800 flex items-center gap-1">
            <CalendarDays size={16} /> {formattedDate}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Status</p>
          <p
            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
              receipt.status === 'Paid'
                ? 'bg-green-100 text-green-800'
                : receipt.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-orange-100 text-orange-800'
            }`}
          >
            {receipt.status}
          </p>
        </div>
      </section>

      <section className="overflow-x-auto mb-6">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-right">Hours</th>
              <th className="p-2 text-right">Rate (₹)</th>
              <th className="p-2 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.length ? (
              receipt.items.map((item, idx) => (
                <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-2">{item.description}</td>
                  <td className="p-2 text-right">{item.hours}</td>
                  <td className="p-2 text-right">{item.rate.toLocaleString()}</td>
                  <td className="p-2 text-right">{item.amount.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No items found for this receipt.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="flex flex-col sm:flex-row sm:justify-end gap-4">
        <div className="flex-1 max-w-xs bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-500 text-sm">Subtotal</p>
          <p className="text-lg font-semibold flex items-center gap-1">
            <IndianRupee size={18} /> {receipt.subtotal.toLocaleString()}
          </p>
        </div>
        <div className="flex-1 max-w-xs bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-500 text-sm">Tax</p>
          <p className="text-lg font-semibold flex items-center gap-1">
            <IndianRupee size={18} /> {receipt.tax.toLocaleString()}
          </p>
        </div>
        <div className="flex-1 max-w-xs bg-indigo-50 p-4 rounded-lg">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-indigo-700 flex items-center gap-1">
            <IndianRupee size={20} /> {receipt.total.toLocaleString()}
          </p>
        </div>
      </section>
    </div>
  )
}