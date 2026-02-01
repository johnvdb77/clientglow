'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LineItem {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface AddOrderModalProps {
  customer: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddOrderModal({ customer, isOpen, onClose, onSuccess }: AddOrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [notes, setNotes] = useState('');
  
  // Current product being added
  const [currentProduct, setCurrentProduct] = useState({
    productName: '',
    quantity: '1',
    price: '',
  });
  
  // List of products in this order
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const addLineItem = () => {
    if (!currentProduct.productName || !currentProduct.price) {
      alert('Please enter product name and price');
      return;
    }

    const quantity = parseInt(currentProduct.quantity);
    const price = parseFloat(currentProduct.price);
    const subtotal = quantity * price;

    setLineItems([
      ...lineItems,
      {
        productName: currentProduct.productName,
        quantity,
        price,
        subtotal,
      }
    ]);

    // Reset current product form
    setCurrentProduct({
      productName: '',
      quantity: '1',
      price: '',
    });
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lineItems.length === 0) {
      alert('Please add at least one product to the order');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'orders'), {
        customerId: customer.id,
        customerName: customer.name,
        lineItems: lineItems,
        totalAmount: totalAmount,
        orderDate: orderDate,
        paymentStatus: paymentStatus,
        notes: notes,
        createdAt: serverTimestamp(),
      });

      alert('Order added successfully!');
      onSuccess();
      onClose();
      
      // Reset everything
      setLineItems([]);
      setCurrentProduct({ productName: '', quantity: '1', price: '' });
      setOrderDate(new Date().toISOString().split('T')[0]);
      setPaymentStatus('paid');
      setNotes('');
    } catch (error) {
      console.error('Error adding order:', error);
      alert('Failed to add order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Add Order</h2>
            <p className="text-sm text-gray-600">for {customer.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Add Product Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Add Products</h3>
            
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={currentProduct.productName}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, productName: e.target.value })}
                  placeholder="Product name (e.g., Aloe Vera Gel)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="number"
                    min="1"
                    value={currentProduct.quantity}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: e.target.value })}
                    placeholder="Qty"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                    placeholder="Price €"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* Order Items List */}
          {lineItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-2">
                {lineItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × €{item.price.toFixed(2)} = €{item.subtotal.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="text-red-600 hover:text-red-800 ml-4"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-purple-600">€{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Date *
              </label>
              <input
                type="date"
                required
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status *
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (samples, discounts, etc.)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g., Included 2 free samples, 10% discount applied"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || lineItems.length === 0}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : `Add Order (${lineItems.length} items)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}