'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
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
  t: any;
  userId: string;
}

export default function AddOrderModal({ customer, isOpen, onClose, onSuccess, t, userId }: AddOrderModalProps) {
  if (!isOpen || !customer) return null;

  const [loading, setLoading] = useState(false);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [notes, setNotes] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  
  const [currentProduct, setCurrentProduct] = useState({
    productName: '',
    quantity: '1',
    price: '',
  });
  
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

  useEffect(() => {
  const fetchProducts = async () => {
    if (!userId) return;
    try {
      const q = query(
        collection(db, 'products'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const productData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  fetchProducts();
}, [userId]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lineItems.length === 0) {
      alert('Please add at least one product to the order');
      return;
    }
  
    setLoading(true);
  
    try {
      // First, check and update inventory for each line item
      for (const item of lineItems) {
        // Find product in inventory by name
        const productQuery = query(
          collection(db, 'products'),
          where('userId', '==', userId),
          where('name', '==', item.productName)
        );
        const productSnapshot = await getDocs(productQuery);
        
        if (!productSnapshot.empty) {
          const productDoc = productSnapshot.docs[0];
          const currentQuantity = productDoc.data().quantity;
          const newQuantity = currentQuantity - item.quantity;
          
          if (newQuantity < 0) {
            alert(`Not enough stock for ${item.productName}. Available: ${currentQuantity}`);
            setLoading(false);
            return;
          }
          
          // Update inventory
          await updateDoc(doc(db, 'products', productDoc.id), {
            quantity: newQuantity
          });
        }
      }
  
      // Save the order
      await addDoc(collection(db, 'orders'), {
        customerId: customer.id,
        customerName: customer.name,
        lineItems: lineItems,
        totalAmount: totalAmount,
        orderDate: orderDate,
        paymentStatus: paymentStatus,
        notes: notes,
        userId: userId,
        createdAt: serverTimestamp(),
      });
  
      alert('Order added successfully!');
      onSuccess();
      onClose();
      
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{t('order.addOrder')}</h2>
            <p className="text-sm text-gray-600">{t('order.for')} {customer.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">{t('order.addProducts')}</h3>
            
            <div className="space-y-3">
              <div>
              <select
  value={currentProduct.productName}
  onChange={(e) => {
    const selectedProduct = products.find(p => p.name === e.target.value);
    setCurrentProduct({
      ...currentProduct,
      productName: e.target.value,
      price: selectedProduct ? selectedProduct.sellPrice.toString() : ''
    });
  }}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
>
  <option value="">{t('order.selectProduct') || 'Select a product...'}</option>
  {products.map((product) => (
    <option key={product.id} value={product.name}>
      {product.name} - €{product.sellPrice.toFixed(2)} ({product.quantity} {t('inventory.inStock') || 'in stock'})
    </option>
  ))}
</select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="number"
                    min="1"
                    value={currentProduct.quantity}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: e.target.value })}
                    placeholder={t('order.quantity')}
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
                    placeholder={t('order.price')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  + {t('order.add')}
                </button>
              </div>
            </div>
          </div>

          {lineItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{t('order.orderItems')}</h3>
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
                      {t('order.remove')}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{t('order.totalAmount')}:</span>
                  <span className="text-2xl font-bold text-purple-600">€{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('order.orderDate')} *
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
                {t('order.paymentStatus')} *
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="paid">{t('orderHistory.paid')}</option>
                <option value="pending">{t('orderHistory.pending')}</option>
                <option value="refunded">{t('orderHistory.refunded')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('order.notes')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder={t('order.notesPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || lineItems.length === 0}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : `${t('order.addOrder')} (${lineItems.length} ${t('order.items')})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}