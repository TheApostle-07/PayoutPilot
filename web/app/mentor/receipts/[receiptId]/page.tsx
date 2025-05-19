

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  FileText,
  IndianRupee,
  DownloadCloud,
  ArrowLeft,
} from 'lucide-react';

interface ReceiptItem {
  description: string;
  date: string;
  amount: number;
}

interface Receipt {
  id: string;
  mentor: string;
  date: string;
  items: ReceiptItem[];
  taxes: number;
  total: number;
  status: 'Pending' | 'Sent' | 'Viewed';
}

const DUMMY_RECEIPTS: Record<string, Receipt> = {
  RC1001: {
    id: 'RC1001',
    mentor: 'Alice Johnson',
    date: '2025-04-20',
    items: [
      { description: 'Live Session (30 mins)', date: '2025-04-18', amount: 2000 },
      { description: 'Review (1 hour)', date: '2025-04-19', amount: 2000 },
    ],
    taxes: 200,
    total: 4200,
    status: 'Sent',
  },
  RC1002: {
    id: 'RC1002',
    mentor: 'Bob Smith',
    date: '2025-04-22',
    items: [
      { description: 'Evaluation (45 mins)', date: '2025-04-20', amount: 1500 },
      { description: 'Live Session (15 mins)', date: '2025-04-21', amount: 500 },
    ],
    taxes: 150,
    total: 2150,
    status: 'Viewed',
  },
  // add more dummy receipts as needed
};

export default function MentorReceiptDetailPage() {
  const { receiptId } = useParams();
  const router = useRouter();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const data = receiptId ? DUMMY_RECEIPTS[receiptId] : undefined;
    setReceipt(data ?? null);
    setLoading(false);
  }, [receiptId]);

  function handleDownload() {
    if (!printRef.current) return;
    window.print();
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 font-medium">Receipt not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/mentor/receipts" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft size={20} /> All Receipts
        </Link>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          <DownloadCloud size={18} /> Download PDF
        </button>
      </div>

      <div ref={printRef} className="space-y-4">
        <header className="flex items-center gap-3 text-indigo-600">
          <FileText size={28} />
          <div>
            <h1 className="text-2xl font-bold">Receipt {receipt.id}</h1>
            <p className="text-sm text-gray-500">{new Date(receipt.date).toLocaleDateString()}</p>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Mentor</p>
            <p className="font-medium text-gray-800">{receipt.mentor}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Status</p>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                receipt.status === 'Sent'
                  ? 'bg-green-100 text-green-800'
                  : receipt.status === 'Viewed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {receipt.status}
            </span>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Line Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Description</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="p-2">{item.description}</td>
                    <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="p-2 flex items-center gap-1">
                      <IndianRupee size={16} /> {item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex justify-end space-x-8 text-gray-800">
          <div>
            <p className="text-sm text-gray-500">Taxes</p>
            <p className="flex items-center gap-1">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(receipt.taxes)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold flex items-center gap-1">
              <IndianRupee size={20} /> {receipt.total.toLocaleString()}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}