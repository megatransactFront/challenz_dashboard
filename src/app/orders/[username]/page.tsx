'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { FilterDropdown } from '../components/FilterDropdown';
import { OrderHistory } from '../components/OrderHistory';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export type Order = {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  status:
    | 'PENDING_PAYMENT'
    | 'AWAITING_FULFILLMENT'
    | 'FULFILLED'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'PAYMENT_FAILED'
    | 'CANCELED'
    | 'RETURN_REQUESTED'
    | 'REFUNDED'
    | 'NO_REFUND';
  date: string;
};

export default function OrderHistoryWrapper() {
  const { username } = useParams();
  const [status, setStatus] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!username || typeof username !== 'string') return;

    const fetchOrders = async () => {
      try {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const res = await fetch(`/api/orders?${params.toString()}`);
        const data = await res.json();

        const filtered = data.filter(
          (order: Order) =>
            order.customer.toLowerCase().replace(/\s+/g, '') ===
            username.toLowerCase()
        );
        setOrders(filtered);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, [username, status, startDate, endDate]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = status ? order.status === status : true;
      const matchesStart = startDate ? new Date(order.date) >= new Date(startDate) : true;
      const matchesEnd = endDate ? new Date(order.date) <= new Date(endDate) : true;
      return matchesStatus && matchesStart && matchesEnd;
    });
  }, [orders, status, startDate, endDate]);

  return (
    <div className="p-8 space-y-6">
      <Card className="p-4 md:p-6 space-y-4">
        <div className="flex justify-center mb-8">
          <span className="bg-white text-black px-6 py-2 rounded-full text-xl font-semibold border border-gray-400 shadow">
            Order History: {typeof username === 'string' ? decodeURIComponent(username) : ''}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 items-end justify-center">
          <FilterDropdown
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              'PENDING_PAYMENT',
              'AWAITING_FULFILLMENT',
              'FULFILLED',
              'SHIPPED',
              'DELIVERED',
              'PAYMENT_FAILED',
              'CANCELED',
              'RETURN_REQUESTED',
              'REFUNDED',
              'NO_REFUND'
            ]}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Start Date</label>
            <Input
              type="date"
              value={startDate ?? ''}
              onChange={(e) => setStartDate(e.target.value || null)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">End Date</label>
            <Input
              type="date"
              value={endDate ?? ''}
              min={startDate ?? undefined}
              onChange={(e) => setEndDate(e.target.value || null)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-transparent">Clear</label>
            <button
              onClick={() => {
                setStatus(null);
                setStartDate(null);
                setEndDate(null);
              }}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Clear
            </button>
          </div>
        </div>

        <OrderHistory orders={filteredOrders} />
      </Card>

      <div className="flex justify-center mt-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1a4d5f] border border-black rounded-full shadow hover:bg-secondary hover:shadow-md transition duration-200"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );
}
