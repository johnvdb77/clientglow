'use client';

interface CustomerDetailModalProps {
  customer: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CustomerDetailModal({ customer, isOpen, onClose, onEdit, onDelete }: CustomerDetailModalProps) {
  console.log('Modal props:', { onEdit: typeof onEdit, onDelete: typeof onDelete });
  
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
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900">{customer.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
              <p className="text-gray-900">{customer.phone || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Birthday</label>
              <p className="text-gray-900">{customer.birthday || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Customer Since</label>
              <p className="text-gray-900">{customer.customerSince || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Order Date</label>
              <p className="text-gray-900">{customer.lastOrderDate || '-'}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
            <p className="text-gray-900">{customer.address || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Special Days</label>
            <p className="text-gray-900">{customer.specialDays || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Preferences</label>
            <p className="text-gray-900">{customer.preferences || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
            <p className="text-gray-900 whitespace-pre-wrap">{customer.notes || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Remarks</label>
            <p className="text-gray-900 whitespace-pre-wrap">{customer.remarks || '-'}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
  <button
    onClick={onEdit}
    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
  >
    Edit
  </button>
  <button
    onClick={onDelete}
    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
  >
    Delete
  </button>
  <button
    onClick={onClose}
    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
  >
    Close
  </button>
</div> 
      </div>
    </div>
  );
}