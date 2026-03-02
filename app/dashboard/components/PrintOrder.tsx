'use client';

interface LineItem {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  customerName: string;
  lineItems: LineItem[];
  subtotal?: number;
  discount?: number;
  discountType?: string;
  discountAmount?: number;
  totalAmount: number;
  orderDate: string;
  paymentStatus: string;
  paymentMethod?: string;
  notes?: string;
}

interface PrintOrderProps {
    order: Order;
    t: any;
    onClose: () => void;
    consultantName?: string;
  }

  export default function PrintOrder({ order, t, onClose, consultantName }: PrintOrderProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Screen buttons - hidden when printing */}
        <div className="flex justify-between mb-4 print:hidden">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ← {t('actions.close') || 'Close'}
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            🖨️ {t('order.print') || 'Print'}
          </button>
        </div>

        {/* Printable content */}
        <div className="print:m-0 print:p-0">
        <div className="text-center mb-6">
  <h1 className="text-2xl font-bold">{consultantName || 'ClientGlow'}</h1>
  <p className="text-gray-600">{t('order.orderConfirmation') || 'Order Confirmation'}</p>
</div>

          <div className="border-b pb-4 mb-4">
            <p className="font-semibold">{t('customer.name') || 'Customer'}: {order.customerName}</p>
            <p className="text-gray-600">{t('order.orderDate') || 'Date'}: {new Date(order.orderDate).toLocaleDateString()}</p>
            <p className="text-gray-600">{t('order.orderId') || 'Order ID'}: #{order.id.slice(-6).toUpperCase()}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">{t('order.orderItems') || 'Items'}:</h3>
            <div className="space-y-2">
              {order.lineItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.productName}</span>
                  <span>€{item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-1">
            {order.subtotal && order.discountAmount && order.discountAmount > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span>{t('order.subtotal') || 'Subtotal'}:</span>
                  <span>€{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-red-600">
                  <span>{t('order.discount') || 'Discount'}:</span>
                  <span>-€{order.discountAmount.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>{t('order.totalAmount') || 'Total'}:</span>
              <span>€{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between">
              <span className="font-medium">{t('order.paymentStatus') || 'Payment'}:</span>
              <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                {order.paymentStatus === 'paid' 
                  ? (t('orderHistory.paid') || 'PAID') 
                  : order.paymentStatus === 'pending'
                  ? (t('orderHistory.pending') || 'PENDING')
                  : (t('orderHistory.refunded') || 'REFUNDED')}
              </span>
            </div>
            {order.paymentMethod && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>{t('order.paymentMethod') || 'Method'}:</span>
                <span>{order.paymentMethod === 'cash' ? (t('order.cash') || 'Cash') : (t('order.bank') || 'Bank')}</span>
              </div>
            )}
          </div>

          {order.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">{t('order.notes') || 'Notes'}: {order.notes}</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
            <p>{t('order.thankYou') || 'Thank you for your order!'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}