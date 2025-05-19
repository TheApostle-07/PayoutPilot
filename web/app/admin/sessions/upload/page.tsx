'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { CloudUpload, CheckCircle, AlertCircle } from 'lucide-react';

interface SessionData {
  mentorName: string;
  sessionDate: string;
  sessionType: string;
  duration: string;
  rate: string;
}

export default function AdminSessionsUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [manual, setManual] = useState<SessionData>({
    mentorName: '',
    sessionDate: '',
    sessionType: '',
    duration: '',
    rate: '',
  });
  const [manualMsg, setManualMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const handleManualChange = (
    field: keyof SessionData,
    value: string
  ) => {
    setManual({ ...manual, [field]: value });
    setManualMsg(null);
  };

  const handleAddManual = () => {
    // rudimentary validation
    if (
      !manual.mentorName ||
      !manual.sessionDate ||
      !manual.sessionType ||
      !manual.duration ||
      !manual.rate
    ) {
      setManualMsg({ ok: false, text: 'Please fill all fields.' });
      return;
    }
    setPreview((prev) => [...prev, manual]);
    setManual({
      mentorName: '',
      sessionDate: '',
      sessionType: '',
      duration: '',
      rate: '',
    });
    setManualMsg({ ok: true, text: 'Session added.' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false);
    setPreview([]);
    const selected = e.target.files?.[0] || null;
    if (!selected) {
      setError('No file selected.');
      return;
    }
    if (!selected.name.match(/\.csv$/i)) {
      setError('Please select a valid CSV file.');
      return;
    }
    setFile(selected);

    Papa.parse<SessionData>(selected, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          setError('Error parsing CSV. Please check the file format.');
        } else {
          setPreview(results.data);
        }
      },
      error: (err) => {
        setError(`Parsing error: ${err.message}`);
      },
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulate API upload
      await new Promise((res) => setTimeout(res, 1500));
      setSuccess(true);
      setFile(null);
      setPreview([]);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">Upload Sessions CSV</h1>
      <p className="text-gray-600 mb-6">
        Select a CSV file containing mentor session details (name, date, type, duration, rate).
      </p>

      {/* CSV Upload */}
      <div className="mb-8 flex justify-center">
        <label className="inline-flex items-center gap-2 bg-blue-600 px-6 py-3 text-white font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition">
          <CloudUpload size={20} />
          <span>Choose&nbsp;CSV&nbsp;File</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* OR Divider */}
      <div className="flex items-center my-8 gap-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Manual Add */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Session Manually</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Mentor Name"
            value={manual.mentorName}
            onChange={(e) => handleManualChange('mentorName', e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="date"
            placeholder="Date"
            value={manual.sessionDate}
            onChange={(e) => handleManualChange('sessionDate', e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Session Type"
            value={manual.sessionType}
            onChange={(e) => handleManualChange('sessionType', e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Duration (hrs)"
            value={manual.duration}
            onChange={(e) => handleManualChange('duration', e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Rate (₹)"
            value={manual.rate}
            onChange={(e) => handleManualChange('rate', e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {manualMsg && (
          <div
            className={`mt-3 p-3 rounded flex items-center gap-2 ${
              manualMsg.ok
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {manualMsg.ok ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {manualMsg.text}
          </div>
        )}

        <button
          onClick={handleAddManual}
          className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Add Session
        </button>
      </div>

      {preview.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Preview ({preview.length} rows)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Mentor</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Duration</th>
                  <th className="px-4 py-2 text-left">Rate</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 10).map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">{row.mentorName}</td>
                    <td className="px-4 py-2">{row.sessionDate}</td>
                    <td className="px-4 py-2">{row.sessionType}</td>
                    <td className="px-4 py-2">{row.duration}</td>
                    <td className="px-4 py-2">
                      ₹{Number(row.rate).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-gray-600 text-sm">
              Showing first {Math.min(preview.length, 10)} of {preview.length} rows.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`w-full flex items-center justify-center gap-2 py-3 text-white rounded-lg transition ${
          loading
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Uploading…' : 'Upload Sessions'}
      </button>

      {success && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded flex items-center gap-2">
          <CheckCircle size={20} /> Upload successful!
        </div>
      )}
    </div>
  );
}