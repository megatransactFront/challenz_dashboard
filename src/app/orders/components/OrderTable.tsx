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
import { useEffect, useState } from 'react';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING_PAYMENT':
      return 'text-yellow-500 font-semibold';
    case 'AWAITING_FULFILLMENT':
      return 'text-blue-500 font-semibold';
    case 'FULFILLED':
      return 'text-indigo-500 font-semibold';
    case 'SHIPPED':
      return 'text-purple-500 font-semibold';
    case 'DELIVERED':
      return 'text-emerald-500 font-semibold';
    case 'PAYMENT_FAILED':
      return 'text-red-500 font-semibold';
    case 'CANCELED':
      return 'text-red-600 font-semibold';
    case 'RETURN_REQUESTED':
      return 'text-orange-500 font-semibold';
    case 'REFUNDED':
      return 'text-green-600 font-semibold';
    case 'NO_REFUND':
      return 'text-gray-500 font-semibold';
    default:
      return '';
  }
};

export function OrderTable({
  search,
  status,
  startDate,
  endDate,
}: {
  search: string;
  status: string | null;
  startDate: string | null;
  endDate: string | null;
}) {

  type Order = {
    id: string;
    customer: string;
    product: string;
    quantity: number;
    status: string;
    date: string;
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status && status !== 'Any') params.append('status', status);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  fetch(`/api/orders?${params.toString()}`)
    .then((res) => res.json())
    .then((data) => setOrders(data))
    .catch((err) => console.error('Failed to fetch orders:', err));
}, [search, status, startDate, endDate]);


  
const totalPages = Math.max(1, Math.ceil(orders.length / rowsPerPage));
const paginated = orders.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
            <TableHead>Manage Shipment</TableHead>
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
                  </div>
                </div>
              </TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>
                <span className={getStatusColor(order.status)}>{order.status}</span>
              </TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>
                <Link href={`/orders/shipment/${order.id}`}>
                  <button className="inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold text-white bg-[#1a4d5f] border border-black rounded-full shadow hover:bg-secondary hover:shadow-md transition duration-200">
                    Manage
                  </button>
                </Link>
              </TableCell>
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
