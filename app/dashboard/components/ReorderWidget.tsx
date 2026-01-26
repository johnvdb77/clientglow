'use client';

interface Customer {
  id: string;
  name: string;
  email: string;
  lastOrderDate: string;
}

interface ReorderWidgetProps {
  customers: Customer[];
}

export default function ReorderWidget({ customers }: ReorderWidgetProps) {
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
    .filter(customer => customer.daysSince >= 30)
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
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyBadge(customer.urgency)}`}>
                {customer.daysSince} days ago
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}