'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { User as UserIcon, Cpu as AiIcon, Send } from 'lucide-react'

type Message = {
  id: number
  sender: 'human' | 'ai'
  content: string
}

const initialMessages: Message[] = [
  { id: 1, sender: 'human', content: 'Hello, how can I improve my coding skills?' },
  { id: 2, sender: 'ai', content: 'Practice regularly and build projects to enhance your skills.' },
  { id: 3, sender: 'human', content: 'Any recommended resources?' },
  { id: 4, sender: 'ai', content: 'Yes, check out freeCodeCamp, LeetCode, and MDN Web Docs.' },
]

export default function ChatPage() {
  const params = useParams()
  const conversationId = params.conversationId || 'unknown'
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [viewMode, setViewMode] = useState<'human' | 'ai' | 'all'>('all')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages, viewMode])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const newMessage: Message = {
      id: messages.length + 1,
      sender: viewMode === 'all' ? 'human' : viewMode,
      content: trimmed,
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const filteredMessages =
    viewMode === 'all'
      ? messages
      : messages.filter(message => message.sender === viewMode)

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 bg-white shadow-md rounded-md">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Conversation: {conversationId}
        </h1>
      </header>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setViewMode('human')}
          className={`flex items-center space-x-2 px-4 py-1 rounded-full border transition-colors ${
            viewMode === 'human'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
          aria-pressed={viewMode === 'human'}
        >
          <UserIcon className="w-5 h-5" />
          <span>Human</span>
        </button>
        <button
          onClick={() => setViewMode('ai')}
          className={`flex items-center space-x-2 px-4 py-1 rounded-full border transition-colors ${
            viewMode === 'ai'
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
          aria-pressed={viewMode === 'ai'}
        >
          <AiIcon className="w-5 h-5" />
          <span>AI</span>
        </button>
        <button
          onClick={() => setViewMode('all')}
          className={`flex items-center space-x-2 px-4 py-1 rounded-full border transition-colors ${
            viewMode === 'all'
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
          aria-pressed={viewMode === 'all'}
        >
          <span>All</span>
        </button>
      </div>

      <main className="flex-1 overflow-y-auto mb-4 p-4 border rounded-md bg-gray-50">
        {filteredMessages.length === 0 ? (
          <p className="text-center text-gray-500">No messages to display.</p>
        ) : (
          filteredMessages.map(message => (
            <div
              key={message.id}
              className={`mb-3 flex ${
                message.sender === 'human' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  message.sender === 'human'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-green-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </main>

      <form
        onSubmit={e => {
          e.preventDefault()
          handleSend()
        }}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          ref={inputRef}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder={`Send a message as ${
            viewMode === 'all' ? 'Human' : viewMode === 'human' ? 'Human' : 'AI'
          }`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          aria-label="Message input"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className={`p-2 rounded-md ${
            input.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } transition-colors`}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
