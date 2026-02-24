'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  sellPrice: number;
  userId: string;
  createdAt: any;
}

export default function InventoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [locale, setLocale] = useState('en');
  const [t, setT] = useState<any>({});

  useEffect(() => {
    const savedLocale = localStorage.getItem('clientglow_locale') || 'en';
    setLocale(savedLocale);
    
    const loadMessages = async () => {
      try {
        const msgs = await import(`../../../messages/${savedLocale}.json`);
        setT(msgs.default);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English
        const msgs = await import(`../../../messages/en.json`);
        setT(msgs.default);
      }
    };
    
    loadMessages();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'products'),
        where('userId', '==', user.uid),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);
      const productData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(t.inventory?.delete + '?')) return;
    
    try {
      await deleteDoc(doc(db, 'products', productId));
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: t.inventory?.outOfStock || 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity <= 5) return { label: t.inventory?.lowStock || 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: t.inventory?.inStock || 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const totalInventoryValue = products.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0);
  const totalSellValue = products.reduce((sum, p) => sum + (p.quantity * p.sellPrice), 0);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img src="/logo.png" alt="ClientGlow" className="h-10" />
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-purple-600 hover:text-purple-800 font-medium">
                ← {t.nav?.backToHome || 'Back to Dashboard'}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.inventory?.title || 'Inventory'}</h1>
            <p className="text-gray-600">{t.inventory?.subtitle || 'Manage your product stock'}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            + {t.inventory?.addProduct || 'Add Product'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">{t.inventory?.products || 'Products'}</p>
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">{t.inventory?.totalValue || 'Total Value'} ({t.inventory?.purchasePrice || 'Purchase'})</p>
            <p className="text-3xl font-bold text-purple-600">€{totalInventoryValue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">{t.inventory?.totalValue || 'Total Value'} ({t.inventory?.sellPrice || 'Sell'})</p>
            <p className="text-3xl font-bold text-green-600">€{totalSellValue.toFixed(2)}</p>
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">{t.inventory?.noProducts || 'No products yet'}</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              {t.inventory?.addFirst || 'Add your first product'} →
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t.inventory?.productName || 'Product Name'}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t.inventory?.quantity || 'Quantity'}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t.inventory?.purchasePrice || 'Purchase Price'}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t.inventory?.sellPrice || 'Sell Price'}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t.inventory?.stock || 'Status'}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t.actions?.actions || 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const status = getStockStatus(product.quantity);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-gray-600">{product.quantity}</td>
                      <td className="px-6 py-4 text-gray-600">€{product.purchasePrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-600">€{product.sellPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          >
                            {t.inventory?.edit || 'Edit'}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            {t.inventory?.delete || 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          userId={user?.uid}
          t={t}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchProducts();
          }}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          t={t}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}

// Add Product Modal Component
function AddProductModal({ userId, t, onClose, onSuccess }: { userId: string; t: any; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    purchasePrice: '',
    sellPrice: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'products'), {
        name: formData.name,
        quantity: parseInt(formData.quantity),
        purchasePrice: parseFloat(formData.purchasePrice),
        sellPrice: parseFloat(formData.sellPrice),
        userId: userId,
        createdAt: serverTimestamp(),
      });
      onSuccess();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6">{t.inventory?.addProduct || 'Add Product'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.inventory?.productName || 'Product Name'} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.inventory?.quantity || 'Quantity'} *
            </label>
            <input
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.inventory?.purchasePrice || 'Purchase Price'} (€) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.inventory?.sellPrice || 'Sell Price'} (€) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.sellPrice}
              onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              {t.inventory?.cancel || 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? '...' : (t.inventory?.save || 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Product Modal Component
function EditProductModal({ product, t, onClose, onSuccess }: { product: Product; t: any; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    quantity: product.quantity.toString(),
    purchasePrice: product.purchasePrice.toString(),
    sellPrice: product.sellPrice.toString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateDoc(doc(db, 'products', product.id), {
        name: formData.name,
        quantity: parseInt(formData.quantity),
        purchasePrice: parseFloat(formData.purchasePrice),
        sellPrice: parseFloat(formData.sellPrice),
      });
      onSuccess();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6">{t.inventory?.edit || 'Edit'} {product.name}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.inventory?.productName || 'Product Name'} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.inventory?.quantity || 'Quantity'} *
            </label>
            <input
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.inventory?.purchasePrice || 'Purchase Price'} (€) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.inventory?.sellPrice || 'Sell Price'} (€) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.sellPrice}
              onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              {t.inventory?.cancel || 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? '...' : (t.inventory?.save || 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}