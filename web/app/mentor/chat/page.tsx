'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useUser } from '../../../src/lib/firebaseClient';
import { Send, User, Cpu, Loader2 } from 'lucide-react';
// Removed imports of Configuration, OpenAIApi from 'openai'
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

interface Message {
  id: string;
  sender: 'mentor' | 'admin';
  text: string;
  timestamp: string;
}

export default function ChatPage() {
  const user = useUser();
  const socketRef = useRef<Socket | null>(null);
  const [humanMessages, setHumanMessages] = useState<Message[]>([]);
  const [aiMessages, setAiMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'AI' | 'Human'>('Human');

  useEffect(() => {
    if (!user?.uid) return;
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
      const room = `mentor_${user.uid}`;
      socket.emit('joinRoom', { uid: user.uid, room });
      console.log(`🟢 User ${user.uid} joined room ${room}`);
    });
    socket.on('adminMessage', (msg: Message) => {
      setHumanMessages(prev => [...prev, msg]);
    });
    socket.on('aiMessage', (msg: Message) => {
      setAiMessages(prev => [...prev, msg]);
    });
    // load initial dummy messages
    const dummyHuman: Message[] = [
      { id: '1', sender: 'admin', text: 'Welcome to PayoutChat! How can I assist you today?', timestamp: '2025-05-15T10:00:00Z' },
      { id: '2', sender: 'mentor', text: 'Hi, I have a question about my recent payout.', timestamp: '2025-05-15T10:05:00Z' },
    ];
    const dummyAi: Message[] = [
      { id: 'ai1', sender: 'admin', text: 'Hello! I am your AI assistant. How may I help?', timestamp: '2025-05-15T09:00:00Z' },
    ];
    setHumanMessages(dummyHuman);
    setAiMessages(dummyAi);
    return () => { socket.disconnect(); };
  }, [user]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [humanMessages, aiMessages, mode]);

  // Removed OpenAI initialization

  // Handle sending a new message
  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setSending(true);

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'mentor',
      text,
      timestamp: new Date().toISOString(),
    };
    setInput('');

    if (mode === 'Human') {
      // send to admin via socket
      socketRef.current?.emit('mentorMessage', {
        room: `mentor_${user?.uid}`,
        text,
        sender: 'mentor',
        timestamp: new Date().toISOString(),
      });
      setHumanMessages(prev => [...prev, newMsg]);
    } else if (mode === 'AI') {
      // always show mentor's message
      setAiMessages(prev => [...prev, newMsg]);
      // call our backend AI route
      const messagesForAI = aiMessages.map(m => ({
        role: m.sender === 'mentor' ? 'user' : 'assistant',
        content: m.text,
      }));
      messagesForAI.push({ role: 'user', content: text });

      try {
        const response = await fetch('http://localhost:4000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: messagesForAI }),
        });
        const data = await response.json();
        // extract AI reply from various possible response shapes
        const aiTextRaw =
          data.reply ??
          data.text ??
          data.message ??
          data.choices?.[0]?.message?.content;
        const aiText = typeof aiTextRaw === 'string' ? aiTextRaw.trim() : '';
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'admin',
          text: aiText || 'AI did not return a valid response.',
          timestamp: new Date().toISOString(),
        };
        setAiMessages(prev => [...prev, aiMsg]);
        socketRef.current?.emit('aiMessage', aiMsg);
      } catch (err) {
        const errMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'admin',
          text: 'AI response failed. Please try again.',
          timestamp: new Date().toISOString(),
        };
        setAiMessages(prev => [...prev, errMsg]);
      }
    }

    setSending(false);
  };

  // Edge case: if user not loaded, show loading
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading chat…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Messages list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-4"
      >
        {(mode === 'Human' ? humanMessages : aiMessages).length === 0 ? (
          <p className="text-center text-gray-500">
            No messages yet. Start the conversation!
          </p>
        ) : (
          (mode === 'Human' ? humanMessages : aiMessages).map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'mentor' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg space-y-1 ${
                  msg.sender === 'mentor'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm break-words">{msg.text}</p>
                <span className="block text-xs text-gray-400 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        {/* AI typing loader */}
        {mode === 'AI' && sending && (
          <div className="flex justify-start">
            <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-200 text-gray-800 flex items-center gap-2 animate-pulse">
              <Loader2 className="animate-spin text-gray-500" />
              <span className="text-sm text-gray-600">AI is typing…</span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="flex items-center border-t px-4 py-2 bg-gray-50"
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={sending}
        />
          <div className="ml-2 flex items-center bg-gray-200 rounded-full p-1">
            <button
              type="button"
              onClick={() => setMode('Human')}
              className={`p-2 rounded-full transition ${mode === 'Human' ? 'bg-white shadow' : 'text-gray-500 hover:bg-gray-300'}`}
              title="Human Chat"
            >
              <User size={20} />
            </button>
            <button
              type="button"
              onClick={() => setMode('AI')}
              className={`p-2 rounded-full transition ${mode === 'AI' ? 'bg-white shadow' : 'text-gray-500 hover:bg-gray-300'}`}
              title="AI Assistant"
            >
              <Cpu size={20} />
            </button>
          </div>
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className={`ml-2 p-2 rounded-full ${
            sending || !input.trim()
              ? 'bg-blue-200 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition`}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
