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
    case 'PENDING_PAYMENT': return 'text-yellow-500 font-semibold';
    case 'AWAITING_FULFILLMENT': return 'text-blue-500 font-semibold';
    case 'FULFILLED': return 'text-indigo-500 font-semibold';
    case 'SHIPPED': return 'text-purple-500 font-semibold';
    case 'DELIVERED': return 'text-emerald-500 font-semibold';
    case 'PAYMENT_FAILED': return 'text-red-500 font-semibold';
    case 'CANCELED': return 'text-red-600 font-semibold';
    case 'RETURN_REQUESTED': return 'text-orange-500 font-semibold';
    case 'REFUNDED': return 'text-green-600 font-semibold';
    case 'NO_REFUND': return 'text-gray-500 font-semibold';
    default: return '';
  }
};

type Order = {
  orderid: string;
  created_at: string;
  total_price: number;
  total_uwc_used: number;
  users: { username: string };
  orderitems: {
    id: string;
    quantity: number;
    status: string;
    products: {
      name: string;
    };
  }[];
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
  const [flattened, setFlattened] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status && status !== 'Any') params.append('status', status);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const res = await fetch(`/api/orders?${params.toString()}`);
        const orders: Order[] = await res.json();

        const searchTerm = search.trim().toLowerCase().replace(/\s+/g, '');

        const filteredOrders = searchTerm
          ? orders.filter((order) => {
              const username = order.users?.username?.toLowerCase().replace(/\s+/g, '') || '';
              const orderid = order.orderid?.toLowerCase();
              return username.includes(searchTerm) || orderid.includes(searchTerm);
            })
          : orders;

        const expanded = filteredOrders.flatMap((order) =>
          order.orderitems.map((item) => ({
            orderid: order.orderid,
            username: order.users?.username,
            created_at: order.created_at,
            total_price: order.total_price,
            total_uwc_used: order.total_uwc_used,
            itemId: item.id,
            id: item.id,
            product: item.products?.name || 'N/A',
            quantity: item.quantity,
            status: item.status,
          }))
        );

        const statusFiltered =
          status && status !== 'Any'
            ? expanded.filter((item) => item.status === status)
            : expanded;

        setFlattened(statusFiltered);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [search, status, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(flattened.length / rowsPerPage));
  const paginated = flattened.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const goToPrev = () => setPage((p) => Math.max(p - 1, 1));
  const goToNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="w-full bg-white rounded-xl shadow p-6 overflow-x-auto">
      {loading ? (
        <div className="text-center py-10 text-gray-500 font-medium text-sm">
          Loading orders...
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 text-gray-700 uppercase text-sm">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Total UWC</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50 transition duration-200">
                  <TableCell>{item.orderid}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>
                    <div className="relative group cursor-pointer">
                      <span>{item.product}</span>
                      <div className="absolute z-10 hidden group-hover:block bg-black text-white text-xs px-3 py-2 rounded shadow-lg w-max mt-2">
                        Item ID: {item.itemId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.total_price}</TableCell>
                  <TableCell>{item.total_uwc_used}</TableCell>
                  <TableCell>
                    <span className={getStatusColor(item.status)}>{item.status}</span>
                  </TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Link href={`/orders/shipment/${item.id}`}>
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
        </>
      )}
    </div>
  );
}
