'use client';

import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const shortId = (id: string | number) => `#${String(id).slice(0, 8)}`;
const money = (n?: number) => `$${Number(n ?? 0).toFixed(2)}`;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING_PAYMENT': return 'text-yellow-500 font-semibold';
    case 'AWAITING_FULFILLMENT': return 'text-blue-500 font-semibold';
    case 'FULFILLED': return 'text-indigo-500 font-semibold';
    case 'SHIPPED': return 'text-purple-500 font-semibold';
    case 'DELIVERED': return 'text-emerald-500 font-semibold';
    case 'CANCELED': return 'text-red-600 font-semibold';
    case 'REFUNDED': return 'text-green-600 font-semibold';
    default: return '';
  }
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  total_usd: number;
  uwc_held: number;
  order_items: {
    id: string;
    quantity: number;
    product: { name: string } | null;
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
  const [rows, setRows] = useState<any[]>([]);
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

        const needle = search.trim().toLowerCase();
        const filtered = needle
          ? orders.filter((o) => String(o.id).toLowerCase().includes(needle))
          : orders;

        const expanded = filtered.flatMap((order) =>
          order.order_items.map((it) => ({
            orderid: order.id,
            created_at: order.created_at,
            total_price: order.total_usd,
            total_uwc_used: order.uwc_held,
            id: it.id,
            product: it.product?.name ?? 'N/A',
            quantity: it.quantity,
            status: order.status,
          }))
        );

        const statusFiltered =
          status && status !== 'Any'
            ? expanded.filter((row) => row.status === status)
            : expanded;

        setRows(statusFiltered);
        setPage(1);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [search, status, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const paginated = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
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
              {paginated.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50 transition duration-200">
                  <TableCell className="font-mono text-xs sm:text-sm">
                    {shortId(row.orderid)}
                  </TableCell>

                  <TableCell>{row.product}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{money(row.total_price)}</TableCell>
                  <TableCell>{row.total_uwc_used}</TableCell>

                  <TableCell>
                    <span className={getStatusColor(row.status)}>
                      {row.status.replace(/_/g, ' ')}
                    </span>
                  </TableCell>

                  <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>

                  <TableCell>
                    <Link href={`/orders/shipment/${row.orderid}`}>
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
            <button onClick={goToPrev} disabled={page === 1} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
              ← Prev
            </button>
            <span className="text-gray-600">Page {page} of {totalPages}</span>
            <button onClick={goToNext} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
