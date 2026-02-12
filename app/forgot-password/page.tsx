'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <img 
              src="/logo.png" 
              alt="ClientGlow" 
              className="h-16 mx-auto mb-4"
            />
            <p className="text-gray-600">Reset your password</p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">
                <p className="font-medium">Check your email!</p>
                <p className="text-sm mt-1">We've sent a password reset link to {email}</p>
              </div>
              <Link 
                href="/login" 
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maria@example.com"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="text-center">
                <Link 
                  href="/login" 
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}