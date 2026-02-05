'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import Link from 'next/link';

const pink = 'bg-pink-500 text-white';
const blue = 'bg-slate-800 text-white';

type Product = { id: string; name: string | null; image_url: string | null };
type OrderItem = {
  id: string;
  quantity: number;
  region: string | null;
  created_at: string;
  product: Product | null;
};
type OrderPayload = {
  id: string;
  status: string;
  region: string | null;
  shipping_address: string | null;
  created_at: string;
  total_usd: number | null;
  uwc_held: number | null;
  order_items: OrderItem[];
};

type StructuredAddress = {
  name?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  email?: string;
  phone?: string;
};
type RawAddress = { raw: string };
type AnyAddress = StructuredAddress | RawAddress;

function parseAddress(jsonOrText?: string | null): AnyAddress | null {
  if (!jsonOrText) return null;
  try {
    return JSON.parse(String(jsonOrText)) as StructuredAddress;
  } catch {
    return { raw: String(jsonOrText) };
  }
}

const ORDER_FLOW = [
  'PENDING_PAYMENT',
  'AWAITING_FULFILLMENT',
  'FULFILLED',
  'SHIPPED',
  'DELIVERED',
] as const;

const SIDE_BRANCH = ['PAYMENT_FAILED', 'CANCELED'] as const;

const statusPill = (s?: string) => {
  const k = String(s || '').toUpperCase();
  const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold';
  switch (k) {
    case 'PENDING_PAYMENT':
      return `${base} bg-amber-100 text-amber-800 border border-amber-200`;
    case 'AWAITING_FULFILLMENT':
      return `${base} bg-sky-100 text-sky-800 border border-sky-200`;
    case 'FULFILLED':
      return `${base} bg-indigo-100 text-indigo-800 border border-indigo-200`;
    case 'SHIPPED':
      return `${base} bg-purple-100 text-purple-800 border border-purple-200`;
    case 'DELIVERED':
      return `${base} bg-emerald-100 text-emerald-800 border border-emerald-200`;
    case 'CANCELED':
      return `${base} bg-rose-100 text-rose-800 border border-rose-200`;
    case 'PAYMENT_FAILED':
      return `${base} bg-red-100 text-red-800 border border-red-200`;
    default:
      return `${base} bg-slate-100 text-slate-800 border border-slate-200`;
  }
};

const RegionTag = ({ region }: { region?: string | null }) =>
  region ? (
    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-xs font-medium">
      {region}
    </span>
  ) : null;

const money = (n?: number | null) => `$${Number(n ?? 0).toFixed(2)}`;

export default function ShipmentDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [order, setOrder] = useState<OrderPayload | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data: OrderPayload | { error: string } = await res.json();
        if ('error' in data) throw new Error(data.error);
        setOrder(data);
        setStatus(data.status);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const shipping = useMemo<AnyAddress | null>(
    () => parseAddress(order?.shipping_address || null),
    [order]
  );

  const totalItems = useMemo(
    () => (order?.order_items || []).reduce((s, it) => s + Number(it.quantity || 0), 0),
    [order]
  );

  const updateStatus = (next: string) => setStatus(next);

  const handleSave = async () => {
    if (!order) return;
    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const out = await res.json();
    if (res.ok) {
      alert(out.message || 'Order status updated');
      router.refresh();
    } else {
      alert(out.error || 'Failed to update');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-10">
        <div className="bg-white border border-slate-200 rounded-2xl shadow p-8 text-center text-slate-500">
          Loading order…
        </div>
      </div>
    );
  }
  if (!order) {
    return (
      <div className="max-w-6xl mx-auto p-10">
        <div className="bg-white border border-rose-200 rounded-2xl shadow p-8 text-center text-rose-600">
          Order not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-slate-900">
              Order <span className="font-mono">#{String(order.id).slice(0, 8)}</span>
            </div>
            <div className="text-sm text-slate-600">
              Placed {new Date(order.created_at).toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RegionTag region={order.region} />
            <span className={statusPill(status)}>{status.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-900">Items</div>
              <div className="text-sm text-slate-600">Total items: {totalItems}</div>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {order.order_items.map((it) => (
                <div key={it.id} className="py-4 flex items-start gap-4">
                  {it.product?.image_url ? (
                    <Image
                      src={it.product.image_url}
                      alt=""
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-lg object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-slate-50 grid place-items-center text-[10px] text-slate-400 border border-slate-200">
                      No img
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">
                      {it.product?.name || 'Item'}
                    </div>
                    <div className="text-sm text-slate-600">
                      Qty {it.quantity} • Region {it.region || order.region || '—'}
                    </div>
                    <div className="text-xs text-slate-400">
                      Added {new Date(it.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block text-xs text-slate-500">
                      Item ID:{' '}
                      <span className="font-mono">
                        {String(it.id).slice(0, 8)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="text-lg font-semibold text-slate-900 mb-3">Shipping</div>

            {shipping && 'raw' in shipping ? (
              <div className="text-slate-700 whitespace-pre-wrap">{shipping.raw}</div>
            ) : shipping ? (
              <div className="text-slate-700 space-y-1">
                {shipping.name && <div className="font-medium">{shipping.name}</div>}
                {shipping.streetAddress && <div>{shipping.streetAddress}</div>}
                <div>
                  {[shipping.city, shipping.state, shipping.postcode]
                    .filter(Boolean)
                    .join(', ')
                    .replace(', ,', ', ')}
                </div>
                {shipping.country && <div>{shipping.country}</div>}
                <div className="pt-2 grid gap-1 text-sm text-slate-500">
                  {shipping.email && <div>Email: {shipping.email}</div>}
                  {shipping.phone && <div>Phone: {shipping.phone}</div>}
                </div>
              </div>
            ) : (
              <div className="text-slate-500">—</div>
            )}

            <div className="mt-4 text-sm text-slate-600">
              Region:{' '}
              <span className="font-medium text-slate-800">{order.region || '—'}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="text-lg font-semibold text-slate-900 mb-3">Order Summary</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Total Paid</div>
                <div className="mt-1 text-xl font-semibold text-slate-900">
                  {money(order.total_usd)}
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">UWC Used</div>
                <div className="mt-1 text-xl font-semibold text-slate-900">
                  {Number(order.uwc_held ?? 0)}
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Line Items
                </div>
                <div className="mt-1 text-xl font-semibold text-slate-900">
                  {order.order_items.length}
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-500">
              Order ID:{' '}
              <span className="font-mono">{order.id}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold text-slate-900">Status & Actions</div>
              <span className={statusPill(status)}>{status.replace(/_/g, ' ')}</span>
            </div>

            <div className="text-sm text-slate-600 mb-3">Primary flow</div>
            <div className="flex flex-col items-center gap-3">
              {ORDER_FLOW.map((s, i, arr) => (
                <div key={s} className="flex flex-col items-center">
                  <Button
                    onClick={() => updateStatus(s)}
                    className={clsx('w-56 rounded-lg shadow-sm', status === s ? pink : blue)}
                  >
                    {s.replace(/_/g, ' ')}
                  </Button>
                  {i < arr.length - 1 && <span className="text-xl text-slate-300">↓</span>}
                </div>
              ))}
            </div>

            <div className="mt-6 text-sm text-slate-600 mb-2">Side branch</div>
            <div className="grid grid-cols-1 gap-2">
              {SIDE_BRANCH.map((s) => (
                <Button
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={clsx('w-full rounded-lg shadow-sm', status === s ? pink : blue)}
                >
                  {s.replace(/_/g, ' ')}
                </Button>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3">
              <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                Save Changes
              </Button>
              <Link
                href="/orders"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#1a4d5f] border border-black rounded-full shadow hover:bg-secondary hover:shadow-md transition"
              >
                Back to Orders
              </Link>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="text-sm text-slate-600">Quick Meta</div>
            <div className="mt-2 space-y-1 text-slate-800">
              <div>
                <span className="text-slate-500">Placed: </span>
                {new Date(order.created_at).toLocaleString()}
              </div>
              <div>
                <span className="text-slate-500">Region: </span>
                {order.region || '—'}
              </div>
              <div className="truncate">
                <span className="text-slate-500">Order ID: </span>
                <span className="font-mono">{order.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
