'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import Link from 'next/link';
import { useState } from 'react';

type Order = {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled' | 'Returned';
  date: string;
};


const orders: Order[] = [
  { id: 'ORD001', customer: 'Kelsey Jackson', product: 'Tumbler', quantity: 3, status: 'Cancelled', date: '2025-06-29' },
  { id: 'ORD002', customer: 'Haley Johnson', product: 'Hoodie', quantity: 1, status: 'Processing', date: '2025-06-15' },
  { id: 'ORD003', customer: 'Elizabeth Gonzalez', product: 'Yoga Mat', quantity: 4, status: 'Returned', date: '2025-06-19' },
  { id: 'ORD004', customer: 'Michelle Lester', product: 'Keychain', quantity: 5, status: 'Cancelled', date: '2025-06-13' },
  { id: 'ORD005', customer: 'Hannah Horton', product: 'Smart Cup', quantity: 4, status: 'Pending', date: '2025-06-16' },
  { id: 'ORD006', customer: 'Vanessa Werner', product: 'Pro Shaker', quantity: 4, status: 'Shipped', date: '2025-06-20' },
  { id: 'ORD007', customer: 'Renee Jones', product: 'Yoga Mat', quantity: 3, status: 'Delivered', date: '2025-06-25' },
  { id: 'ORD008', customer: 'Melissa Hunt', product: 'Yoga Mat', quantity: 5, status: 'Completed', date: '2025-06-05' },
  { id: 'ORD009', customer: 'Stephen Walker', product: 'Hoodie', quantity: 2, status: 'Completed', date: '2025-06-06' },
  { id: 'ORD010', customer: 'Hunter Ramos', product: 'Smart Cup', quantity: 1, status: 'Delivered', date: '2025-06-10' },
  { id: 'ORD011', customer: 'Ryan Wong', product: 'Smart Cup', quantity: 4, status: 'Shipped', date: '2025-06-09' },
  { id: 'ORD012', customer: 'Jennifer Gilmore', product: 'Smart Cup', quantity: 4, status: 'Processing', date: '2025-06-22' },
  { id: 'ORD013', customer: 'Elijah Moore', product: 'Glow Mask', quantity: 5, status: 'Completed', date: '2025-06-23' },
  { id: 'ORD014', customer: 'Sheila Price', product: 'Pro Shaker', quantity: 5, status: 'Pending', date: '2025-06-28' },
  { id: 'ORD015', customer: 'Kimberly Wood', product: 'Yoga Mat', quantity: 3, status: 'Processing', date: '2025-06-25' },
  { id: 'ORD016', customer: 'Adam Hubbard', product: 'Keychain', quantity: 4, status: 'Shipped', date: '2025-06-20' },
  { id: 'ORD017', customer: 'Colleen Greene', product: 'Pro Shaker', quantity: 2, status: 'Pending', date: '2025-06-11' },
  { id: 'ORD018', customer: 'Anthony Douglas', product: 'Eco Bottle', quantity: 1, status: 'Delivered', date: '2025-06-14' },
  { id: 'ORD019', customer: 'Kimberly Kline', product: 'Pro Shaker', quantity: 4, status: 'Returned', date: '2025-06-14' },
  { id: 'ORD020', customer: 'Marcia Glass', product: 'Smart Cup', quantity: 5, status: 'Completed', date: '2025-06-23' },
  { id: 'ORD021', customer: 'Kendra Mercado', product: 'Pro Shaker', quantity: 4, status: 'Cancelled', date: '2025-06-12' },
  { id: 'ORD022', customer: 'Tiffany Mckee', product: 'Notebook', quantity: 2, status: 'Delivered', date: '2025-06-13' },
  { id: 'ORD023', customer: 'Lauren Ramos', product: 'Hoodie', quantity: 5, status: 'Shipped', date: '2025-06-15' },
  { id: 'ORD024', customer: 'Ryan Ramos', product: 'Pro Shaker', quantity: 3, status: 'Completed', date: '2025-06-03' },
  { id: 'ORD025', customer: 'Alyssa Smith', product: 'Notebook', quantity: 4, status: 'Returned', date: '2025-06-16' },
];


const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'text-yellow-500 font-semibold';
    case 'Processing':
      return 'text-blue-500 font-semibold';
    case 'Shipped':
      return 'text-indigo-500 font-semibold';
    case 'Delivered':
      return 'text-emerald-500 font-semibold';
    case 'Completed':
      return 'text-green-600 font-semibold';
    case 'Cancelled':
      return 'text-red-600 font-semibold';
    case 'Returned':
      return 'text-orange-500 font-semibold';
    default:
      return '';
  }
};


export function OrderTable({
  search,
  status,
  startDate,
  endDate,
  customData,
}: {
  search: string;
  status: string | null;
  startDate: string | null;
  endDate: string | null;
  customData?: Order[];
}) {
 const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const source = customData ?? orders;

  const filtered = source.filter((order) => {
    const matchSearch = search
      ? order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchStatus = status && status !== 'Any' ? order.status === status : true;

    const matchDate =
      (!startDate || new Date(order.date) >= new Date(startDate)) &&
      (!endDate || new Date(order.date) <= new Date(endDate));

    return matchSearch && matchStatus && matchDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const goToPrev = () => setPage((p) => Math.max(p - 1, 1));
  const goToNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="w-full bg-white rounded-xl shadow p-6 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 text-gray-700 uppercase text-sm">
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((order) => (
            <TableRow key={order.id} className="hover:bg-gray-50 transition duration-200">
              <TableCell>{order.id}</TableCell>
              <TableCell>
                <Link
                  href={`/orders/${order.customer.replace(/\s+/g, '').toLowerCase()}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {order.customer}
                </Link>
              </TableCell>
              <TableCell>
                <div className="relative group cursor-pointer">
                  <span>{order.product}</span>
                  <div className="absolute left-0 z-10 hidden group-hover:block bg-black text-white text-xs px-3 py-2 rounded shadow-lg w-max mt-2">
                    Product: {order.product} <br />
                    Inventory Left: TBD
                  </div>
                </div>
              </TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>
                <span className={getStatusColor(order.status)}>{order.status}</span>
              </TableCell>
              <TableCell>{order.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4 px-2 text-sm">
        <button
          onClick={goToPrev}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          ← Prev
        </button>
        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={goToNext}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}