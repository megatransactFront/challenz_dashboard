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
import { useEffect, useMemo, useState } from 'react';

const UWC_PER_DOLLAR = 2;

const moneyFmt = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
const money = (n?: number) => moneyFmt.format(Number(n ?? 0));
const shortId = (id: string | number) => `#${String(id).slice(0, 8)}`;

const statusChip = (status: string) => {
  switch (status) {
    case 'PENDING_PAYMENT': return 'bg-yellow-50 text-yellow-700 ring-yellow-200';
    case 'AWAITING_FULFILLMENT': return 'bg-blue-50 text-blue-700 ring-blue-200';
    case 'FULFILLED': return 'bg-indigo-50 text-indigo-700 ring-indigo-200';
    case 'SHIPPED': return 'bg-purple-50 text-purple-700 ring-purple-200';
    case 'DELIVERED': return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'CANCELED': return 'bg-red-50 text-red-700 ring-red-200';
    case 'REFUNDED': return 'bg-green-50 text-green-700 ring-green-200';
    default: return 'bg-gray-50 text-gray-700 ring-gray-200';
  }
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  total_usd: number;
  uwc_held: number | null;
  order_items: {
    id: string;
    quantity: number;
    unit_price_usd: number | null;
    discounted_price_usd: number | null;
    uwc_required: number | null;
    product: {
      name: string | null;
      image_url?: string | null;
      price_usd?: number | null; 
    } | null;
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({}); 
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
        const data: Order[] = await res.json();
        setOrders(Array.isArray(data) ? data : []);
        setPage(1);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [search, status, startDate, endDate]);

  const filtered = useMemo(() => {
    const needle = (search || '').trim().toLowerCase();
    return orders
      .filter((o) => !status || status === 'Any' || o.status === status)
      .filter((o) => {
        if (!needle) return true;
        const idMatch = String(o.id).toLowerCase().includes(needle);
        const productText = (o.order_items ?? [])
          .map((it) => it.product?.name || '')
          .join(' ')
          .toLowerCase();
        return idMatch || productText.includes(needle);
      });
  }, [orders, search, status]);

  const rows = useMemo(() => {
    return filtered.map((o) => {
      const sumItemUwc = (o.order_items ?? []).reduce(
        (s, it) => s + Number(it.uwc_required ?? 0),
        0
      );
      const totalUwc = Number(o.uwc_held ?? 0) > 0 ? Number(o.uwc_held) : sumItemUwc;

      const items = (o.order_items ?? []).map((it) => {
        const qty = Number(it.quantity ?? 0);
        const unit = Number(it.unit_price_usd ?? 0);
        const discUnit = Number(
          it.discounted_price_usd == null ? unit : it.discounted_price_usd
        );
        const lineSubtotal = unit * qty;
        const lineTotal = discUnit * qty;
        const saved = Math.max(0, lineSubtotal - lineTotal);
        const uwc = Number(
          it.uwc_required != null ? it.uwc_required : Math.round(saved * UWC_PER_DOLLAR)
        );

        return {
          id: it.id,
          name: it.product?.name ?? 'Item',
          img: it.product?.image_url ?? null,
          qty,
          unit,
          msrp: it.product?.price_usd ?? null,
          saved,
          uwc,
          lineTotal,
        };
      });

      const totalQty = items.reduce((s, x) => s + x.qty, 0);

      return {
        orderid: o.id,
        created_at: o.created_at,
        status: o.status,
        total_price: Number(o.total_usd ?? 0),
        total_uwc_used: totalUwc,
        total_qty: totalQty,
        items,
      };
    });
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const paginated = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const toggleExpand = (id: string) =>
    setExpanded((m) => ({ ...m, [id]: !m[id] }));

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto rounded-2xl">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-gray-50/70 backdrop-blur">
            <TableRow>
              <TableHead className="whitespace-nowrap">Order ID</TableHead>
              <TableHead className="min-w-[460px]">Products</TableHead>
              <TableHead className="whitespace-nowrap">Items</TableHead>
              <TableHead className="whitespace-nowrap">Total Price</TableHead>
              <TableHead className="whitespace-nowrap">Total UWC</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap">Manage</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  <TableCell colSpan={8}>
                    <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="py-14 text-center text-gray-500">
                    No orders match your filters.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row) => {
                const collapsed = !expanded[row.orderid];
                const maxPreview = 3;
                const preview = collapsed ? row.items.slice(0, maxPreview) : row.items;
                const hiddenCount = Math.max(0, row.items.length - maxPreview);

                return (
                  <TableRow key={row.orderid} className="align-top hover:bg-gray-50/60">
                    <TableCell className="font-mono text-xs sm:text-sm whitespace-nowrap align-top pt-4">
                      {shortId(row.orderid)}
                    </TableCell>

                    <TableCell className="align-top">
                      <div className="flex flex-col gap-3">
                        {preview.map((it) => (
                          <div
                            key={it.id}
                            className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                          >
                            {it.img ? (
                              <img
                                src={it.img}
                                alt=""
                                className="h-12 w-12 flex-shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
                              />
                            ) : (
                              <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-100 grid place-items-center ring-1 ring-gray-200">
                                <span className="text-[10px] text-gray-400">No img</span>
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium text-gray-900">
                                {it.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                Qty {it.qty} • {money(it.unit)} each
                                {it.msrp != null && it.msrp !== it.unit ? (
                                  <>
                                    {' '}
                                    <span className="text-gray-400">(MSRP {money(it.msrp)})</span>
                                  </>
                                ) : null}
                              </div>
                              {it.saved > 0 && (
                                <div className="text-sm text-[#0E4B5A]">
                                  You saved {money(it.saved)} with {it.uwc} UWC
                                </div>
                              )}
                            </div>

                            <div className="whitespace-nowrap text-right font-semibold text-gray-900">
                              {money(it.lineTotal)}
                            </div>
                          </div>
                        ))}
                        {hiddenCount > 0 && (
                          <button
                            onClick={() => toggleExpand(row.orderid)}
                            className="self-start text-xs font-medium text-[#1a4d5f] hover:underline"
                          >
                            {collapsed ? `Show ${hiddenCount} more item${hiddenCount > 1 ? 's' : ''}` : 'Show less'}
                          </button>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap align-top pt-4">
                      {row.total_qty}
                    </TableCell>
                    <TableCell className="whitespace-nowrap align-top pt-4">
                      {money(row.total_price)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap align-top pt-4">
                      {row.total_uwc_used}
                    </TableCell>

                    <TableCell className="whitespace-nowrap align-top pt-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1 ${statusChip(
                          row.status
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                        {row.status.replace(/_/g, ' ')}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap align-top pt-4 text-gray-700">
                      {new Date(row.created_at).toLocaleString()}
                    </TableCell>

                    <TableCell className="whitespace-nowrap align-top pt-2">
                      <Link href={`/orders/shipment/${row.orderid}`}>
                        <button className="inline-flex items-center gap-2 rounded-full border border-black bg-[#1a4d5f] px-3 py-1 text-sm font-semibold text-white shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1a4d5f]/30">
                          Manage
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm">
          <div className="text-gray-600">
            Showing <span className="font-medium">{paginated.length}</span> of{' '}
            <span className="font-medium">{rows.length}</span> orders
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200 disabled:opacity-50"
            >
              ← Prev
            </button>
            <span className="text-gray-600">
              Page <span className="font-medium">{page}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
