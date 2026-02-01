'use client';

import { useState } from 'react';
import Link from 'next/link';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'birthday' | 'reorder' | 'promotion' | 'thankyou' | 'custom';
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: 'Happy Birthday',
    subject: 'Happy Birthday {{customerName}}! 🎉',
    body: `Dear {{customerName}},

Happy Birthday! 🎂

I hope you have a wonderful day filled with joy and happiness. To celebrate, I'd love to offer you a special birthday discount on your next order.

Thank you for being such a valued customer!

Warm wishes,
{{consultantName}}`,
    category: 'birthday',
  },
  {
    id: '2',
    name: 'Time to Reorder',
    subject: 'Time for a refill, {{customerName}}?',
    body: `Hi {{customerName}},

I noticed it's been a while since your last order of {{lastProduct}}. You might be running low soon!

Would you like me to set aside your usual order? Just let me know and I'll make sure you don't run out.

Looking forward to hearing from you!

Best regards,
{{consultantName}}`,
    category: 'reorder',
  },
  {
    id: '3',
    name: 'Special Promotion',
    subject: 'Exclusive offer just for you! 💝',
    body: `Hello {{customerName}},

I wanted to share an exciting promotion with you before anyone else!

{{promotionDetails}}

This offer is only available until {{expiryDate}}, so don't miss out!

Would you like to place an order?

Best,
{{consultantName}}`,
    category: 'promotion',
  },
  {
    id: '4',
    name: 'Thank You',
    subject: 'Thank you for your order! 🙏',
    body: `Dear {{customerName}},

Thank you so much for your recent order! I really appreciate your continued support.

Your order of {{orderDetails}} will be ready soon. I'll let you know as soon as it arrives.

If you have any questions, just reach out!

With gratitude,
{{consultantName}}`,
    category: 'thankyou',
  },
];

export default function EmailTemplatesPage() {
  const [templates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [previewVars, setPreviewVars] = useState({
    customerName: 'Maria',
    consultantName: 'Your Name',
    lastProduct: 'Aloe Vera Gel',
    promotionDetails: '20% off all skincare products',
    expiryDate: 'February 15th',
    orderDetails: '2x Lipstick, 1x Face Cream',
  });
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const replaceVariables = (text: string) => {
    let result = text;
    Object.entries(previewVars).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return result;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const filteredTemplates = filterCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === filterCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-purple-600">ClientGlow</h1>
            <Link 
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Templates</h2>
          <p className="text-gray-600">Quick, personalized messages for your customers</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Templates List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Templates</option>
                  <option value="birthday">Birthday</option>
                  <option value="reorder">Reorder</option>
                  <option value="promotion">Promotion</option>
                  <option value="thankyou">Thank You</option>
                </select>
              </div>

              <div className="space-y-2">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedTemplate?.id === template.id
                        ? 'bg-purple-100 border-2 border-purple-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-medium text-gray-900">{template.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{template.category}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Template Preview */}
          <div className="lg:col-span-2">
            {selectedTemplate ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedTemplate.name}</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
                    {selectedTemplate.category}
                  </span>
                </div>

                {/* Variables */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Customize Variables</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(previewVars).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-xs text-gray-600 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setPreviewVars({ ...previewVars, [key]: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Preview</h4>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="mb-4 pb-4 border-b">
                      <p className="text-sm text-gray-600 mb-1">Subject:</p>
                      <p className="font-semibold text-gray-900">{replaceVariables(selectedTemplate.subject)}</p>
                    </div>
                    <div className="whitespace-pre-wrap text-gray-800">
                      {replaceVariables(selectedTemplate.body)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => copyToClipboard(`Subject: ${replaceVariables(selectedTemplate.subject)}\n\n${replaceVariables(selectedTemplate.body)}`)}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                  >
                    📋 Copy to Clipboard
                  </button>
                  <button
                    onClick={() => {
                      const mailto = `mailto:?subject=${encodeURIComponent(replaceVariables(selectedTemplate.subject))}&body=${encodeURIComponent(replaceVariables(selectedTemplate.body))}`;
                      window.location.href = mailto;
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    📧 Open in Email
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Select a template to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}