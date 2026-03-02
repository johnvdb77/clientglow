'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import OrderHistory from './OrderHistory';
import AddOrderModal from './AddOrderModal';
import QuickTemplates from './QuickTemplates';

interface CustomerDetailModalProps {
  customer: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  userId: string;  // Add this line
}

export default function CustomerDetailModal({ customer, isOpen, onClose, onEdit, onDelete, userId }: CustomerDetailModalProps) {
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);
  const t = useTranslations();
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{customer.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{t('customer.email')}</label>
            <p className="text-gray-900">{customer.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('customer.phone')}</label>
              <p className="text-gray-900">{customer.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('customer.birthday')}</label>
              <p className="text-gray-900">{customer.birthday}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('customer.customerSince')}</label>
              <p className="text-gray-900">{customer.customerSince}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('customer.lastOrderDate')}</label>
              <p className="text-gray-900">{customer.lastOrderDate}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{t('customer.address')}</label>
            <p className="text-gray-900">{customer.address}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{t('customer.specialDays')}</label>
            <p className="text-gray-900">{customer.specialDays}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{t('customer.preferences')}</label>
            <p className="text-gray-900">{customer.preferences}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{t('customer.notes')}</label>
            <p className="text-gray-900 whitespace-pre-wrap">{customer.notes}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{t('customer.remarks')}</label>
            <p className="text-gray-900 whitespace-pre-wrap">{customer.remarks}</p>
          </div>

          {customer.tags && customer.tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('customer.tags')}</label>
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag: string) => {
                  const tagColors: Record<string, string> = {
                    'VIP': 'bg-purple-100 text-purple-800',
                    'New': 'bg-blue-100 text-blue-800',
                    'Active': 'bg-green-100 text-green-800',
                    'Inactive': 'bg-gray-100 text-gray-800',
                    'Potential': 'bg-yellow-100 text-yellow-800',
                  };
                  return (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors[tag] || 'bg-gray-100 text-gray-800'}`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <OrderHistory 
  customerId={customer.id} 
  onAddOrder={() => setShowAddOrder(true)}
  key={refreshKey}
  userId={userId}
  t={t}
/>

<QuickTemplates 
  customer={customer}
  isOpen={showTemplates}
/>

<div className="mt-6 space-y-3">
  <button
    onClick={() => setShowTemplates(!showTemplates)}
    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    📧 {t('actions.sendEmail')}
  </button>
  
  <div className="flex gap-3">
    <button
      onClick={onEdit}
      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
    >
      {t('actions.edit')}
    </button>
    <button
      onClick={onDelete}
      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      {t('actions.delete')}
    </button>
    <button
      onClick={onClose}
      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
    >
      {t('actions.close')}
    </button>
  </div>
</div>

<AddOrderModal
  customer={customer}
  isOpen={showAddOrder}
  onClose={() => setShowAddOrder(false)}
  onSuccess={() => {
    setShowAddOrder(false);
    setRefreshKey(prev => prev + 1);
  }}
  t={t}
  userId={userId}
/>
        </div>
      </div>
    );
}