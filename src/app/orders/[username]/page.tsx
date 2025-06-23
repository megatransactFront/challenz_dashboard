'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { FilterDropdown } from '../components/FilterDropdown';
import { OrderHistory } from '../components/OrderHistory';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

type Order = {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled' | 'Returned';
  date: string;
};

const allOrders: Order[] = [
  { id: 'ORD001', customer: 'Kelsey Jackson', product: 'Tumbler', quantity: 3, status: 'Returned', date: '2025-06-29' },
  { id: 'ORD002', customer: 'Haley Johnson', product: 'Hoodie', quantity: 1, status: 'Processing', date: '2025-06-15' },
  { id: 'ORD003', customer: 'Elizabeth Gonzalez', product: 'Yoga Mat', quantity: 4, status: 'Cancelled', date: '2025-06-19' },
  { id: 'ORD004', customer: 'Michelle Lester', product: 'Keychain', quantity: 5, status: 'Cancelled', date: '2025-06-13' },
  { id: 'ORD005', customer: 'Hannah Horton', product: 'Smart Cup', quantity: 4, status: 'Pending', date: '2025-06-16' },
  { id: 'ORD006', customer: 'Kelsey Jackson', product: 'Smart Cup', quantity: 2, status: 'Delivered', date: '2025-06-01' },
  { id: 'ORD007', customer: 'Vanessa Werner', product: 'Pro Shaker', quantity: 4, status: 'Shipped', date: '2025-06-20' },
  { id: 'ORD008', customer: 'Renee Jones', product: 'Yoga Mat', quantity: 3, status: 'Completed', date: '2025-06-25' },
  { id: 'ORD009', customer: 'Melissa Hunt', product: 'Yoga Mat', quantity: 5, status: 'Delivered', date: '2025-06-05' },
  { id: 'ORD010', customer: 'Stephen Walker', product: 'Hoodie', quantity: 2, status: 'Completed', date: '2025-06-06' },
  { id: 'ORD011', customer: 'Hunter Ramos', product: 'Smart Cup', quantity: 1, status: 'Delivered', date: '2025-06-10' },
  { id: 'ORD012', customer: 'Ryan Wong', product: 'Smart Cup', quantity: 4, status: 'Shipped', date: '2025-06-09' },
  { id: 'ORD013', customer: 'Jennifer Gilmore', product: 'Smart Cup', quantity: 4, status: 'Processing', date: '2025-06-22' },
  { id: 'ORD014', customer: 'Elijah Moore', product: 'Glow Mask', quantity: 5, status: 'Completed', date: '2025-06-23' },
  { id: 'ORD015', customer: 'Sheila Price', product: 'Pro Shaker', quantity: 5, status: 'Pending', date: '2025-06-28' },
  { id: 'ORD016', customer: 'Kimberly Wood', product: 'Yoga Mat', quantity: 3, status: 'Processing', date: '2025-06-25' },
  { id: 'ORD017', customer: 'Adam Hubbard', product: 'Keychain', quantity: 4, status: 'Shipped', date: '2025-06-20' },
  { id: 'ORD018', customer: 'Colleen Greene', product: 'Pro Shaker', quantity: 2, status: 'Pending', date: '2025-06-11' },
  { id: 'ORD019', customer: 'Anthony Douglas', product: 'Eco Bottle', quantity: 1, status: 'Delivered', date: '2025-06-14' },
  { id: 'ORD020', customer: 'Kimberly Kline', product: 'Pro Shaker', quantity: 4, status: 'Returned', date: '2025-06-14' },
  { id: 'ORD021', customer: 'Marcia Glass', product: 'Smart Cup', quantity: 5, status: 'Completed', date: '2025-06-23' },
  { id: 'ORD022', customer: 'Kendra Mercado', product: 'Pro Shaker', quantity: 4, status: 'Cancelled', date: '2025-06-12' },
  { id: 'ORD023', customer: 'Tiffany Mckee', product: 'Notebook', quantity: 2, status: 'Delivered', date: '2025-06-13' },
  { id: 'ORD024', customer: 'Lauren Ramos', product: 'Hoodie', quantity: 5, status: 'Shipped', date: '2025-06-15' },
  { id: 'ORD025', customer: 'Ryan Ramos', product: 'Pro Shaker', quantity: 3, status: 'Completed', date: '2025-06-03' },
  { id: 'ORD026', customer: 'Alyssa Smith', product: 'Notebook', quantity: 4, status: 'Returned', date: '2025-06-16' },
];


export default function OrderHistoryWrapper() {
  const { username } = useParams();
  const [status, setStatus] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    const decoded = typeof username === 'string' ? decodeURIComponent(username) : '';
    const userOrders = allOrders.filter((o) =>
      o.customer.toLowerCase().replace(/\s+/g, '') === decoded.toLowerCase()
    );

    return userOrders.filter((order) => {
      const matchesStatus = status ? order.status === status : true;
      const matchesStart = startDate ? new Date(order.date) >= new Date(startDate) : true;
      const matchesEnd = endDate ? new Date(order.date) <= new Date(endDate) : true;
      return matchesStatus && matchesStart && matchesEnd;
    });
  }, [username, status, startDate, endDate]);

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
          options={['Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled', 'Returned']}

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
