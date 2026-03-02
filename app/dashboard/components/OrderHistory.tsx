'use client';

import EditOrderModal from './EditOrderModal';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import PrintOrder from './PrintOrder';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LineItem {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  lineItems: LineItem[];
  totalAmount: number;
  orderDate: string;
  paymentStatus: string;
  notes: string;
  // Legacy fields for old single-product orders
  productName?: string;
  quantity?: number;
  price?: number;
}

interface OrderHistoryProps {
  customerId: string;
  onAddOrder: () => void;
  userId: string;
  t: any;
  consultantName?: string;
}

export default function OrderHistory({ customerId, onAddOrder, userId, t, consultantName }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [printingOrder, setPrintingOrder] = useState<any>(null);
  const [editingOrder, setEditingOrder] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('customerId', '==', customerId),
        orderBy('orderDate', 'desc')
      );
      const snapshot = await getDocs(q);
      const orderData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(orderData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [customerId]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mt-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-900">{t('orderHistory.title')}</h3>
    <button
      onClick={onAddOrder}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
    >
      + {t('orderHistory.addOrder')}
    </button>
  </div>

  {loading ? (
    <p className="text-gray-500 text-sm">Loading orders...</p>
  ) : orders.length === 0 ? (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <p className="text-gray-500 mb-2">{t('orderHistory.noOrders')}</p>
      <button
        onClick={onAddOrder}
        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
      >
        {t('orderHistory.addFirst')} →
      </button>
    </div>
  ) : (
    <>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">{t('orderHistory.totalRevenue')}</p>
          <p className="text-2xl font-bold text-purple-600">€{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">{t('orderHistory.totalOrders')}</p>
          <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
        </div>
      </div>

          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {t(`orderHistory.${order.paymentStatus}`)}
                      </span>
                      <button
                        onClick={() => setEditingOrder(order)}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        {t?.('actions.edit') || 'Edit'}
                      </button>
                      <button
  onClick={() => setPrintingOrder(order)}
  className="ml-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
>
  🖨️ {t('order.print') || 'Print'}
  {printingOrder && (
  <PrintOrder
    order={printingOrder}
    t={t}
    onClose={() => setPrintingOrder(null)}
    consultantName={consultantName}
  />
)}
</button>
                    </div>
                    
                    {/* Show line items for new multi-product orders */}
                    {order.lineItems && order.lineItems.length > 0 ? (
                      <div className="space-y-1 mb-2">
                        {order.lineItems.map((item, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="font-medium text-gray-900">{item.productName}</span>
                            <span className="text-gray-600"> - {item.quantity} × €{item.price.toFixed(2)} = €{item.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Show single product for legacy orders */
                      order.productName && (
                        <div className="text-sm mb-2">
                          <span className="font-medium text-gray-900">{order.productName}</span>
                          <span className="text-gray-600"> - {order.quantity} × €{order.price?.toFixed(2)} = €{order.totalAmount.toFixed(2)}</span>
                        </div>
                      )
                    )}
                    
                    {order.notes && (
                      <p className="text-sm text-gray-600 italic mt-2">"{order.notes}"</p>
                    )}
                  </div>
                  
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-gray-900">€{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {editingOrder && (
  <EditOrderModal
    order={editingOrder}
    isOpen={!!editingOrder}
    onClose={() => setEditingOrder(null)}
    onSuccess={() => {
      setEditingOrder(null);
      fetchOrders();
    }}
    t={t}
    userId={userId}
  />
)}
{printingOrder && (
  <PrintOrder
    order={printingOrder}
    t={t}
    onClose={() => setPrintingOrder(null)}
    consultantName={consultantName}
  />
)}
    </div>
  );
}