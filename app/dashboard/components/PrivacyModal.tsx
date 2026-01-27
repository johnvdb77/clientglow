'use client';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="prose prose-sm max-w-none space-y-4">
          <p className="text-gray-600">
            <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6">1. Information We Collect</h3>
          <p className="text-gray-600">
            When you join our waitlist, we collect your email address to notify you when ClientGlow launches. 
            This is the only personal information we collect at this stage.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6">2. How We Use Your Information</h3>
          <p className="text-gray-600">
            Your email address will be used solely to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Send you launch notifications about ClientGlow</li>
            <li>Provide updates about the product development</li>
            <li>Offer early access to the platform</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-6">3. Data Storage and Security</h3>
          <p className="text-gray-600">
            Your data is securely stored using Firebase, Google's cloud platform. We implement appropriate 
            technical and organizational measures to protect your personal information against unauthorized 
            or unlawful processing and accidental loss, destruction, or damage.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6">4. Your Rights (AVG/GDPR)</h3>
          <p className="text-gray-600">
            Under the AVG (Algemene Verordening Gegevensbescherming) and GDPR, you have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Data portability</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-6">5. Data Retention</h3>
          <p className="text-gray-600">
            We will retain your email address until ClientGlow launches or until you request deletion. 
            You can unsubscribe or request data deletion at any time.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6">6. Third-Party Services</h3>
          <p className="text-gray-600">
            We use the following third-party services:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Firebase (Google) - Data storage</li>
            <li>Resend - Email delivery</li>
            <li>Vercel - Website hosting</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-6">7. Contact Us</h3>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy or wish to exercise your rights, 
            please contact us through the website or email us directly.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6">8. Changes to This Policy</h3>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. The "Last updated" date at the top 
            will reflect when changes were made.
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}