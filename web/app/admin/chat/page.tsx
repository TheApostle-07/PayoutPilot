'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Loader2, MessageSquare } from 'lucide-react';

interface Conversation {
  id: string;
  mentorName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all'|'unread'|'read'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredConversations = useMemo(() => {
    let list = conversations;
    if (searchTerm.trim()) {
      list = list.filter(c =>
        c.mentorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filter === 'unread') {
      list = list.filter(c => c.unreadCount > 0);
    } else if (filter === 'read') {
      list = list.filter(c => c.unreadCount === 0);
    }
    return list;
  }, [conversations, searchTerm, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredConversations.length / pageSize));
  const paginated = filteredConversations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Simulate fetching conversation list
  useEffect(() => {
    setLoading(true);
    setError(null);

    const dummyConversations: Conversation[] = [
      {
        id: 'conv1',
        mentorName: 'Alice Johnson',
        lastMessage: 'Thanks for the update!',
        timestamp: '2025-05-10T14:35:00Z',
        unreadCount: 2,
      },
      {
        id: 'conv2',
        mentorName: 'Bob Smith',
        lastMessage: 'When will the payout be processed?',
        timestamp: '2025-05-09T09:20:00Z',
        unreadCount: 0,
      },
      {
        id: 'conv3',
        mentorName: 'Charlie Lee',
        lastMessage: 'I have a question about the invoice.',
        timestamp: '2025-05-08T17:45:00Z',
        unreadCount: 1,
      },
    ];

    const timer = setTimeout(() => {
      setConversations(dummyConversations);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-10">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-10">
        {error}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-gray-500 text-center py-10">
        No conversations found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
      {/* Header */}
      <header className="flex items-center gap-2 text-indigo-600">
        <MessageSquare size={24} />
        <h1 className="text-2xl font-bold">Conversations</h1>
      </header>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search mentors..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="border border-gray-300 rounded p-2 focus:ring focus:ring-indigo-200"
          />
          <select
            value={filter}
            onChange={e => { setFilter(e.target.value as any); setCurrentPage(1); }}
            className="border border-gray-300 rounded p-2 focus:ring focus:ring-indigo-200"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Conversation List */}
      <ul role="list" className="space-y-4">
        {paginated.map(conversation => (
          <li key={conversation.id}>
            <Link
              href={`/admin/chat/${conversation.id}`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">
                  {conversation.mentorName}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(conversation.timestamp).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-sm text-gray-600 truncate">
                  {conversation.lastMessage}
                </p>
                {conversation.unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded transition ${
              currentPage === i + 1
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}