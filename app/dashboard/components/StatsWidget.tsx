'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface Customer {
  id: string;
  name: string;
  createdAt?: any;
}

interface Order {
  id: string;
  totalAmount: number;
  orderDate: string;
  customerId?: string;
  customerName?: string;
}

interface StatsWidgetProps {
  customers: Customer[];
  orders: Order[];
}

export default function StatsWidget({ customers, orders }: StatsWidgetProps) {
  const t = useTranslations();
  
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Revenue this month
    const revenueThisMonth = orders
      .filter(order => new Date(order.orderDate) >= thisMonth)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Revenue last month
    const revenueLastMonth = orders
      .filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= lastMonth && orderDate < thisMonth;
      })
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Growth percentage
    const growth = revenueLastMonth > 0 
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
      : 0;

    // New customers this month
    const newCustomersThisMonth = customers.filter(customer => {
      if (!customer.createdAt) return false;
      const createdDate = customer.createdAt.toDate ? customer.createdAt.toDate() : new Date(customer.createdAt);
      return createdDate >= thisMonth;
    }).length;

    // Top customer by revenue
    const customerRevenue: Record<string, { name: string; total: number }> = {};
    orders.forEach(order => {
      const customerId = order.customerId || 'unknown';
      if (!customerRevenue[customerId]) {
        customerRevenue[customerId] = {
          name: order.customerName || 'Unknown',
          total: 0,
        };
      }
      customerRevenue[customerId].total += order.totalAmount;
    });

    const topCustomer = Object.values(customerRevenue)
      .sort((a, b) => b.total - a.total)[0];

    return {
      totalRevenue,
      revenueThisMonth,
      growth,
      totalCustomers: customers.length,
      newCustomersThisMonth,
      totalOrders: orders.length,
      topCustomer,
    };
  }, [customers, orders]);

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">{t('stats.totalRevenue')}</p>
          <span className="text-2xl">💰</span>
        </div>
        <p className="text-3xl font-bold text-gray-900">€{stats.totalRevenue.toFixed(2)}</p>
        <p className="text-sm text-gray-500 mt-1">{t('stats.allTime')}</p>
      </div>
  
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">{t('stats.thisMonth')}</p>
          <span className="text-2xl">📈</span>
        </div>
        <p className="text-3xl font-bold text-gray-900">€{stats.revenueThisMonth.toFixed(2)}</p>
        {stats.growth !== 0 && (
          <p className={`text-sm mt-1 ${stats.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.growth > 0 ? '↑' : '↓'} {Math.abs(stats.growth).toFixed(1)}% {t('stats.vsLastMonth')}
          </p>
        )}
      </div>
  
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">{t('stats.customers')}</p>
          <span className="text-2xl">👥</span>
        </div>
        <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
        {stats.newCustomersThisMonth > 0 && (
          <p className="text-sm text-green-600 mt-1">
            +{stats.newCustomersThisMonth} {t('stats.thisMonthNew')}
          </p>
        )}
      </div>
  
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">{t('stats.topCustomer')}</p>
          <span className="text-2xl">⭐</span>
        </div>
        {stats.topCustomer ? (
          <>
            <p className="text-lg font-bold text-gray-900 truncate">{stats.topCustomer.name}</p>
            <p className="text-sm text-gray-600 mt-1">€{stats.topCustomer.total.toFixed(2)}</p>
          </>
        ) : (
          <p className="text-sm text-gray-500">{t('stats.noOrders')}</p>
        )}
      </div>
    </div>
  );
}