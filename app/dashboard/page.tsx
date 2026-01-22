'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import AddCustomerModal from './components/AddCustomerModal';
import CustomerDetailModal from './components/CustomerDetailModal';
import EditCustomerModal from './components/EditCustomerModal';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerSince: string;
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

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

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Dashboard</h2>
          <p className="text-gray-600">Manage your customers and track relationships</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6 gap-4">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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
      />

      <EditCustomerModal
        customer={editingCustomer}
        isOpen={!!editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSuccess={fetchCustomers}
      />
    </div>
  );
}