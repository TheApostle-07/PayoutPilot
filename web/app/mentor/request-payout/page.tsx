

'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { IndianRupee, Loader2 } from 'lucide-react';

interface PayoutRequest {
  id: string;
  date: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
}

export default function RequestPayoutPage() {
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<PayoutRequest[]>([]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Simulate fetching balance and past requests
  useEffect(() => {
    const dummyBalance = 12500;
    const dummyHistory: PayoutRequest[] = [
      { id: 'RQ1001', date: '2025-04-25', amount: 4000, status: 'Paid' },
      { id: 'RQ1002', date: '2025-05-02', amount: 3000, status: 'Approved' },
      { id: 'RQ1003', date: '2025-05-08', amount: 2500, status: 'Pending' },
    ];
    setBalance(dummyBalance);
    setHistory(dummyHistory);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (val > balance) {
      setError('Requested amount exceeds available balance.');
      return;
    }

    setLoading(true);
    try {
      // Simulate API request
      await new Promise((r) => setTimeout(r, 1000));

      const newRequest: PayoutRequest = {
        id: `RQ${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: val,
        status: 'Pending',
      };
      setHistory([newRequest, ...history]);
      setBalance(balance - val);
      setAmount('');
      setSuccess('Payout request submitted successfully!');
    } catch {
      setError('Failed to submit payout request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Available Balance */}
      <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
        <div className="flex items-center gap-3 text-indigo-600">
          <IndianRupee size={28} />
          <div>
            <p className="text-sm text-gray-500 uppercase">Available Balance</p>
            <p className="text-3xl font-bold">₹{balance.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">You can request any amount up to your balance.</p>
      </div>

      {/* Request Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Request New Payout</h2>

        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}

        <div>
          <label className="block text-gray-700 mb-1">Amount (₹)</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200"
            placeholder="Enter amount"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 text-white rounded-lg ${
            loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          } transition`}
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Submit Request'}
        </button>
      </form>

      {/* Request History */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Payout Request History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No payout requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Request ID</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Amount (₹)</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <Link href={`/mentor/request-payout/${r.id}`} className="text-indigo-600 hover:underline">
                        {r.id}
                      </Link>
                    </td>
                    <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="p-2">₹{r.amount.toLocaleString()}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          r.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : r.status === 'Approved'
                            ? 'bg-blue-100 text-blue-800'
                            : r.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
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
    </div>
  );
}