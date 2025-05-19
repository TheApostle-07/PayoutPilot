// Enhanced Settings Page
'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Percent,
  Loader2,
  Moon,
  Sun,
  Globe,
  Clock,
  Bell,
  CreditCard,
  Save,
} from 'lucide-react';

/**
 * Realistic settings type with expanded functionality.
 */
interface SettingsData {
  currencySymbol: string;
  timezone: string;
  locale: string;
  platformFee: number;
  gstRate: number;
  taxInclusive: boolean;
  emailNotifications: boolean;
  reminderTime: string;
  darkMode: boolean;
}

const timezones = [
  'UTC',
  'GMT',
  'America/New_York',
  'Europe/London',
  'Asia/Kolkata',
  'Australia/Sydney',
];
const locales = ['en-US', 'en-GB', 'hi-IN', 'es-ES'];
const currencies = ['₹', '$', '€', '£', '¥'];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    currencySymbol: '₹',
    timezone: 'Asia/Kolkata',
    locale: 'hi-IN',
    platformFee: 5,
    gstRate: 18,
    taxInclusive: true,
    emailNotifications: true,
    reminderTime: '09:00',
    darkMode: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Preview dark mode by toggling body class
  useEffect(() => {
    document.body.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  const handleChange =
    (field: keyof SettingsData) =>
    (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      const value =
        field === 'currencySymbol'
          ? e.target.value
          : field === 'darkMode' || field === 'taxInclusive' || field === 'emailNotifications'
          ? (e.target as HTMLInputElement).checked
          : field === 'platformFee' || field === 'gstRate'
          ? parseFloat(e.target.value)
          : e.target.value;
      setSettings((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000));
      setMessage('Settings saved successfully!');
    } catch {
      setMessage('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="flex items-center gap-3 text-indigo-600">
        <SettingsIcon size={28} />
        <h1 className="text-3xl font-bold">Platform Configuration</h1>
      </header>

      {/* Feedback */}
      {message && (
        <div
          className={`p-4 rounded ${
            message.startsWith('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <section className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-indigo-600">
            <Globe size={20} /> General
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Currency */}
            <div>
              <label className="block text-gray-700 font-medium">Currency</label>
              <select
                value={settings.currencySymbol}
                onChange={handleChange('currencySymbol')}
                disabled={loading}
                className="mt-1 border p-2 rounded w-full"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {/* Timezone */}
            <div>
              <label className="block text-gray-700 font-medium">Timezone</label>
              <select
                value={settings.timezone}
                onChange={handleChange('timezone')}
                disabled={loading}
                className="mt-1 border p-2 rounded w-full"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
            {/* Locale */}
            <div>
              <label className="block text-gray-700 font-medium">Locale</label>
              <select
                value={settings.locale}
                onChange={handleChange('locale')}
                disabled={loading}
                className="mt-1 border p-2 rounded w-full"
              >
                {locales.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Payout Settings */}
        <section className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-indigo-600">
            <CreditCard size={20} /> Payouts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-gray-700 font-medium">Platform Fee (%)</label>
              <div className="mt-1 flex items-center gap-2">
                <Percent className="text-gray-500" />
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={settings.platformFee}
                  onChange={handleChange('platformFee')}
                  disabled={loading}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">GST Rate (%)</label>
              <div className="mt-1 flex items-center gap-2">
                <Percent className="text-gray-500" />
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={settings.gstRate}
                  onChange={handleChange('gstRate')}
                  disabled={loading}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={settings.taxInclusive}
                onChange={handleChange('taxInclusive')}
                disabled={loading}
                className="rounded focus:ring-indigo-300"
              />
              <span className="text-gray-700">Prices include tax</span>
            </label>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-indigo-600">
            <Bell size={20} /> Notifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={handleChange('emailNotifications')}
                disabled={loading}
                className="rounded focus:ring-indigo-300"
              />
              <span className="text-gray-700">Enable email notifications</span>
            </label>
            <div>
              <label className="block text-gray-700 font-medium">Daily Reminder Time</label>
              <div className="mt-1 flex items-center gap-2">
                <Clock className="text-gray-500" />
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={handleChange('reminderTime')}
                  disabled={loading}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Appearance Preview */}
        <section className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-indigo-600">
            {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />} Appearance
          </h2>
          <label className="flex items-center gap-3 text-gray-700">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={handleChange('darkMode')}
              disabled={loading}
              className="rounded focus:ring-indigo-300"
            />
            <span>Dark mode preview</span>
          </label>
        </section>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={20} />}
            <span className="font-medium">Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}