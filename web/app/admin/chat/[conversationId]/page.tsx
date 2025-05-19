

'use client';

import React, { useEffect, useState, useRef, FormEvent } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';

/**
 * Dummy message structure
 */
interface Message {
  id: string;
  from: 'admin' | 'mentor';
  authorName: string;
  text: string;
  timestamp: string;
}

export default function ChatConversationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('conversationId') || '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch dummy conversation data on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulate async fetch
    setTimeout(() => {
      const dummy: Message[] = [
        {
          id: 'm1',
          from: 'mentor',
          authorName: 'Mentor Alice',
          text: 'Hi Admin, I have a question about my payout.',
          timestamp: '2025-05-01T10:15:00Z',
        },
        {
          id: 'm2',
          from: 'admin',
          authorName: 'Admin Bob',
          text: 'Sure, let me check your account and get back to you shortly.',
          timestamp: '2025-05-01T10:17:00Z',
        },
      ];
      setMessages(dummy);
      setLoading(false);
    }, 800);
  }, [conversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending new message
  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      // Simulate server send
      const toSend: Message = {
        id: `m${Date.now()}`,
        from: 'admin',
        authorName: 'Admin User',
        text: newMessage.trim(),
        timestamp: new Date().toISOString(),
      };
      // Append locally
      setMessages((prev) => [...prev, toSend]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-white shadow-sm">
        <button
          onClick={() => router.back()}
          className="p-2 rounded hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">Conversation {conversationId}</h2>
        <Link
          href="/admin/chat"
          className="ml-auto text-blue-600 hover:underline"
        >
          Back to Chats
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-gray-500 text-center">No messages yet.</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow-sm"
                   style={{
                     backgroundColor: msg.from === 'admin' ? '#DDE8FF' : '#FFFFFF'
                   }}>
                <div className="text-sm font-medium text-gray-800 mb-1">
                  {msg.authorName}
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">{msg.text}</div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-4 border-t bg-white"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
        />
        <button
          type="submit"
          disabled={sending}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}