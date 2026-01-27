'use client';

interface Customer {
  id: string;
  name: string;
  email: string;
  lastOrderDate: string;
  reorderSnoozeUntil?: string;
}

interface ReorderWidgetProps {
  customers: Customer[];
  onSnooze: (customerId: string, days: number) => void;
}

export default function ReorderWidget({ customers, onSnooze }: ReorderWidgetProps) {
  const today = new Date();
  
  const needsReorder = customers
    .filter(customer => customer.lastOrderDate)
    .map(customer => {
      const lastOrder = new Date(customer.lastOrderDate);
      const daysSince = Math.floor((today.getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...customer,
        daysSince,
        urgency: daysSince >= 60 ? 'high' : daysSince >= 45 ? 'medium' : 'low'
      };
    })
    .filter(customer => {
      if (customer.daysSince < 30) return false;
      
      // Check if snoozed
      if (customer.reorderSnoozeUntil) {
        const snoozeDate = new Date(customer.reorderSnoozeUntil);
        if (snoozeDate > today) return false; // Still snoozed
      }
      
      return true;
    })
    .sort((a, b) => b.daysSince - a.daysSince);

  if (needsReorder.length === 0) {
    return null;
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-orange-50 border-orange-200';
      default: return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-2">🔔</span>
          <h3 className="text-xl font-semibold">Reorder Reminders</h3>
        </div>
        <span className="text-sm text-gray-600">
          {needsReorder.length} {needsReorder.length === 1 ? 'customer needs' : 'customers need'} follow-up
        </span>
      </div>
      
      <div className="space-y-3">
        {needsReorder.map((customer) => (
          <div
            key={customer.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${getUrgencyColor(customer.urgency)}`}
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{customer.name}</p>
              <p className="text-sm text-gray-600">{customer.email}</p>
            </div>
            <div className="text-right flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyBadge(customer.urgency)}`}>
                {customer.daysSince} days ago
              </span>
              <div className="relative group">
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs font-medium">
                  ⏰ Snooze
                </button>
                <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border hidden group-hover:block z-10 whitespace-nowrap">
                  <button
                    onClick={() => onSnooze(customer.id, 7)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    7 days
                  </button>
                  <button
                    onClick={() => onSnooze(customer.id, 14)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    14 days
                  </button>
                  <button
                    onClick={() => onSnooze(customer.id, 30)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    30 days
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}