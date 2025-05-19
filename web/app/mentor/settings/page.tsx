

'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useUser } from '../../../src/lib/firebaseClient';
import { User as UserIcon, Mail, Bell, Cpu, Sun, Moon, Loader2 } from 'lucide-react';

export default function MentorSettingsPage() {
  const user = useUser();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [aiChat, setAiChat] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      // load saved preferences (dummy for now)
      setNotifications(true);
      setAiChat(true);
      setTheme('light');
    }
  }, [user]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // simulate API call
      await new Promise((res) => setTimeout(res, 1000));
      setMessage('Settings saved successfully.');
    } catch {
      setMessage('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderToggle = (
    label: string,
    enabled: boolean,
    onChange: () => void,
    Icon: React.ComponentType<any>
  ) => (
    <label className="flex items-center gap-3">
      <Icon className="text-gray-600" />
      <span className="flex-1">{label}</span>
      <div
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full cursor-pointer transition ${
          enabled ? 'bg-indigo-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  );

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Settings</h1>
        <form onSubmit={handleSave} className="space-y-8 bg-white p-6 rounded-lg shadow">
          {/* Profile Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Display Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full pl-10 pr-3 py-2 bg-gray-100 border rounded cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Preferences</h2>
            <div className="space-y-3">
              {renderToggle(
                'Email Notifications',
                notifications,
                () => setNotifications((v) => !v),
                Bell
              )}
              {renderToggle(
                'AI-Powered Chat',
                aiChat,
                () => setAiChat((v) => !v),
                Cpu
              )}
            </div>
          </section>

          {/* Theme Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Theme</h2>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition border ${
                  theme === 'light'
                    ? 'bg-indigo-50 border-indigo-400'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                <Sun size={16} className="text-yellow-500" />
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition border ${
                  theme === 'dark'
                    ? 'bg-indigo-50 border-indigo-400'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                <Moon size={16} className="text-gray-800" />
                Dark
              </button>
            </div>
          </section>

          {/* Save & Feedback */}
          <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between">
            {message && (
              <p
                className={`mb-3 text-sm ${
                  message.includes('success')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}