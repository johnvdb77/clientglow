'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PrivacyModal from './dashboard/components/PrivacyModal';

export default function Home() {
  const [email, setEmail] = useState('');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'waitlist'), {
        email: email,
        createdAt: serverTimestamp(),
      });
      
      await fetch('/api/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      console.log('Email saved and welcome sent:', email);
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">You're on the list!</h2>
          <p className="text-gray-600">We'll notify you when ClientGlow launches. Get ready to make your clients glow!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Make Your Clients <span className="text-purple-600">Glow</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The CRM built for MLM consultants. Never miss a birthday, follow-up, or reorder reminder again.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tired of scattered customer data?</h2>
          <p className="text-gray-600 mb-6">
            Spreadsheets, sticky notes, and forgotten follow-ups are costing you sales. 
            ClientGlow keeps everything organized so you can focus on what matters: building relationships.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <div className="flex items-start">
              <div className="text-2xl mr-3">🎂</div>
              <div>
                <h3 className="font-semibold text-gray-900">Smart Reminders</h3>
                <p className="text-sm text-gray-600">Never miss a birthday or reorder opportunity</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-2xl mr-3">📧</div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Templates</h3>
                <p className="text-sm text-gray-600">Send personalized messages in seconds</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-2xl mr-3">📊</div>
              <div>
                <h3 className="font-semibold text-gray-900">Order Tracking</h3>
                <p className="text-sm text-gray-600">Know exactly when to suggest refills</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-2xl mr-3">🌍</div>
              <div>
                <h3 className="font-semibold text-gray-900">Multi-language</h3>
                <p className="text-sm text-gray-600">Serve customers in their language</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Be the first to know</h2>
          <p className="text-gray-600 mb-6">Join the waitlist and get early access when we launch</p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Join Waitlist'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-12 text-gray-500 text-sm space-y-2">
          <p>Built for MLM consultants who care about their customers</p>
          <button
            onClick={() => setShowPrivacy(true)}
            className="text-purple-600 hover:text-purple-800 underline"
          >
            Privacy Policy
          </button>
        </div>
      </div>

      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </div>
  );
}