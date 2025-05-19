'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  CalendarDays,
  Clock,
  Tag,
  IndianRupee,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { jsPDF } from 'jspdf';

interface SessionDetail {
  id: string;
  mentor: string;
  date: string; // ISO string
  duration: number; // in minutes
  type: string;
  ratePerHour: number;
  notes?: string;
}

interface PageProps {
  params: { sessionId: string };
}

export default function SessionDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { sessionId } = params;
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Dummy data
    const dummySessions: SessionDetail[] = [
      {
        id: '1',
        mentor: 'Alice Johnson',
        date: '2025-05-12T14:30:00Z',
        duration: 60,
        type: 'Live Session',
        ratePerHour: 4000,
        notes: 'Discussed project milestones.',
      },
      {
        id: '2',
        mentor: 'Bob Smith',
        date: '2025-05-13T10:00:00Z',
        duration: 45,
        type: 'Review',
        ratePerHour: 3500,
        notes: 'Reviewed assignment submissions.',
      },
    ];
    const found = dummySessions.find(s => s.id === sessionId);
    setTimeout(() => {
      if (found) setSession(found);
      else setError('Session not found.');
      setLoading(false);
    }, 700);
  }, [sessionId]);

  const goBack = () => router.push('/mentor/sessions');

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  const computeAmount = (mins: number, rate: number) =>
    ((mins / 60) * rate).toFixed(2);

  function handleDownloadPDF() {
    if (!session) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Session Receipt', 14, 20);
    doc.setFontSize(12);
    doc.text(`Session ID: ${session.id}`, 14, 30);
    doc.text(`Mentor: ${session.mentor}`, 14, 40);
    doc.text(`Date: ${formatDateTime(session.date)}`, 14, 50);
    doc.text(`Duration: ${Math.floor(session.duration/60)}h ${session.duration%60}m`, 14, 60);
    doc.text(`Type: ${session.type}`, 14, 70);
    doc.text(`Rate: ₹${session.ratePerHour.toLocaleString()}/hr`, 14, 80);
    doc.text(`Amount: ₹${computeAmount(session.duration, session.ratePerHour)}`, 14, 90);
    if (session.notes) {
      doc.text('Notes:', 14, 100);
      doc.text(session.notes, 14, 110);
    }
    doc.save(`receipt_${session.id}.pdf`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader2 size={48} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error || 'Unexpected error.'}</p>
        <button
          onClick={goBack}
          className="mt-4 text-indigo-600 hover:underline"
        >
          &larr; Back to sessions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow space-y-6">
      <button
        onClick={goBack}
        className="flex items-center text-indigo-600 hover:text-indigo-800 gap-1"
      >
        <ArrowLeft size={16} /> Back to Sessions
      </button>

      <h1 className="text-3xl font-bold text-gray-800">
        Session with {session.mentor}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <CalendarDays size={20} className="text-indigo-600" />
            <span className="font-medium">
              {formatDateTime(session.date)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={20} className="text-indigo-600" />
            <span className="font-medium">
              {Math.floor(session.duration / 60)}h {session.duration % 60}m
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Tag size={20} className="text-indigo-600" />
            <span className="font-medium">{session.type}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <IndianRupee size={20} className="text-indigo-600" />
            <span className="font-medium">
              Rate: ₹{session.ratePerHour.toLocaleString()}/hr
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <IndianRupee size={20} className="text-indigo-600" />
            <span className="font-medium">
              Amount: ₹
              {computeAmount(session.duration, session.ratePerHour)}
            </span>
          </div>
          {session.notes && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase">
                Notes
              </h2>
              <p className="text-gray-700">{session.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6 border-t">
        <button
          onClick={handleDownloadPDF}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Download Receipt (PDF)
        </button>
        <Link
          href={`/mentor/chat/${session.id}`}
          className="px-5 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition text-center"
        >
          Chat About This Session
        </Link>
      </div>
    </div>
  );
}