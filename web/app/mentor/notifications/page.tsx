

'use client'

import React, { useEffect, useState } from 'react'
import {
  Bell,
  CheckCircle,
  Circle,
  Trash2,
} from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching notifications
    setLoading(true)
    const dummy: Notification[] = [
      {
        id: '1',
        title: 'Session Completed',
        message: 'Your session with Alice Johnson has been completed.',
        date: '2025-05-15T14:30:00Z',
        read: false,
      },
      {
        id: '2',
        title: 'Payout Processed',
        message: 'Your payout of ₹4,000 has been processed.',
        date: '2025-05-14T10:00:00Z',
        read: true,
      },
      {
        id: '3',
        title: 'New Message from Admin',
        message: 'Please update your profile information.',
        date: '2025-05-13T09:15:00Z',
        read: false,
      },
    ]
    setTimeout(() => {
      setNotifications(dummy)
      setLoading(false)
    }, 800)
  }, [])

  // Filter notifications
  const filtered = notifications.filter(n => filter === 'all' || !n.read)

  // Handlers
  const markAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }
  const toggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    )
  }
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }
  const clearRead = () => {
    setNotifications(prev => prev.filter(n => !n.read))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <Bell size={24} />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200 transition"
          >
            {filter === 'all' ? 'Show Unread' : 'Show All'}
          </button>
          <button
            onClick={markAllRead}
            disabled={loading || notifications.every(n => n.read)}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition disabled:opacity-50"
          >
            Mark All Read
          </button>
          <button
            onClick={clearRead}
            disabled={loading || notifications.every(n => !n.read)}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition disabled:opacity-50"
          >
            Clear Read
          </button>
        </div>
      </header>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading notifications…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No notifications to show.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {filtered.map(n => (
            <li
              key={n.id}
              className={`flex items-start justify-between py-4 ${
                n.read ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex-1">
                <h2 className="text-gray-800 font-medium">{n.title}</h2>
                <p className="text-gray-600 text-sm mt-1">{n.message}</p>
                <time className="text-gray-400 text-xs mt-1 block">
                  {new Date(n.date).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </time>
              </div>
              <div className="flex flex-col items-center ml-4 space-y-2">
                <button
                  onClick={() => toggleRead(n.id)}
                  aria-label={
                    n.read ? 'Mark as unread' : 'Mark as read'
                  }
                  className="p-1 text-gray-500 hover:text-gray-700 transition"
                >
                  {n.read ? (
                    <Circle size={20} />
                  ) : (
                    <CheckCircle size={20} />
                  )}
                </button>
                <button
                  onClick={() => deleteNotification(n.id)}
                  aria-label="Delete notification"
                  className="p-1 text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
)}