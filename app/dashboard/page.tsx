'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import AddCustomerModal from './components/AddCustomerModal';
import CustomerDetailModal from './components/CustomerDetailModal';
import EditCustomerModal from './components/EditCustomerModal';
import BirthdayWidget from './components/BirthdayWidget';
import ReorderWidget from './components/ReorderWidget';
import PrivacyModal from './components/PrivacyModal';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerSince: string;
  birthday: string;
  lastOrderDate: string;
  reorderSnoozeUntil?: string;
  tags?: string[];
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const fetchCustomers = async () => {
    try {
      const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const customerData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
      setCustomers(customerData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  const handleDeleteCustomer = async (customer: Customer) => {
    if (!confirm(`Are you sure you want to delete ${customer.name}? This cannot be undone.`)) {
      return;
    }
  
    try {
      await deleteDoc(doc(db, 'customers', customer.id));
      setSelectedCustomer(null);
      fetchCustomers();
      alert('Customer deleted successfully!');
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Failed to delete customer. Please try again.');
    }
  };

  const handleSnoozeReorder = async (customerId: string, days: number) => {
    try {
      const snoozeUntil = new Date();
      snoozeUntil.setDate(snoozeUntil.getDate() + days);
      
      const customerRef = doc(db, 'customers', customerId);
      await updateDoc(customerRef, {
        reorderSnoozeUntil: snoozeUntil.toISOString(),
      });
      
      fetchCustomers();
    } catch (error) {
      console.error('Error snoozing customer:', error);
      alert('Failed to snooze reminder. Please try again.');
    }
  };
  const filteredCustomers = customers.filter(customer => {
    // Text search filter
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm));
    
    // Tag filter
    const matchesTag = !selectedTag || (customer.tags && customer.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-purple-600">ClientGlow</h1>
            <Link 
              href="/"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
      <BirthdayWidget customers={customers} />
      <ReorderWidget customers={customers} onSnooze={handleSnoozeReorder} />
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Dashboard</h2>
          <p className="text-gray-600">Manage your customers and track relationships</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6 gap-4">
          <div className="space-y-3">
  <div className="flex items-center gap-4">
    <div className="flex-1">
      <input
        type="text"
        placeholder="Search by name, email, or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>
    <div className="text-sm text-gray-600">
      {filteredCustomers.length} of {customers.length} customers
    </div>
    <button 
      onClick={() => setIsModalOpen(true)}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 whitespace-nowrap"
    >
      + Add Customer
    </button>
  </div>
  
  <div className="flex items-center gap-2">
    <span className="text-sm text-gray-600">Filter by tag:</span>
    <button
      onClick={() => setSelectedTag('')}
      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
        selectedTag === '' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      All
    </button>
    <button
      onClick={() => setSelectedTag('VIP')}
      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
        selectedTag === 'VIP' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
      }`}
    >
      VIP
    </button>
    <button
      onClick={() => setSelectedTag('New')}
      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
        selectedTag === 'New' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      }`}
    >
      New
    </button>
    <button
      onClick={() => setSelectedTag('Active')}
      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
        selectedTag === 'Active' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'
      }`}
    >
      Active
    </button>
    <button
      onClick={() => setSelectedTag('Inactive')}
      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
        selectedTag === 'Inactive' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
    >
      Inactive
    </button>
    <button
      onClick={() => setSelectedTag('Potential')}
      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
        selectedTag === 'Potential' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      }`}
    >
      Potential
    </button>
  </div>
</div>
          </div>
          
          {loading ? (
            <p className="text-gray-500 text-center py-8">Loading customers...</p>
          ) : filteredCustomers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {searchTerm ? 'No customers match your search.' : 'No customers yet. Click "Add Customer" to get started!'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Customer Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
  {filteredCustomers.map((customer) => (
    <tr key={customer.id} className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">
        <button
          onClick={() => setSelectedCustomer(customer)}
          className="text-purple-600 hover:text-purple-800 font-medium"
        >
          {customer.name}
        </button>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{customer.email}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{customer.phone || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{customer.customerSince || '-'}</td>
      <td className="px-4 py-3 text-sm">
        <div className="flex gap-2">
          <a
            href={`mailto:${customer.email}`}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium"
            title="Send email"
          >
            📧 Email
          </a>
          {customer.phone && (
            <a
              href={`tel:${customer.phone}`}
              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-medium"
              title="Call customer"
            >
              📞 Call
            </a>
          )}
        </div>
      </td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          )}
        </div>
      </div>

  {/* All the modals */}
  <AddCustomerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCustomers}
      />

      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onEdit={() => {
          setEditingCustomer(selectedCustomer);
          setSelectedCustomer(null);
        }}
        onDelete={() => handleDeleteCustomer(selectedCustomer!)}
      />

      <EditCustomerModal
        customer={editingCustomer}
        isOpen={!!editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSuccess={fetchCustomers}
      />

      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </div>
  );
}
