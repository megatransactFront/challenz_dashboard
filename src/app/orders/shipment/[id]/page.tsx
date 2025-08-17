'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import Link from 'next/link';

const pink = 'bg-pink-500 text-white';
const blue = 'bg-slate-800 text-white';

type ItemPayload = {
  id: string;
  quantity: number;
  created_at: string;
  region: string;
  productName: string;
  order: { id: string; status: string; shipping_address?: string | null } | null;
};

const ORDER_FLOW = [
  'PENDING_PAYMENT',
  'AWAITING_FULFILLMENT',
  'FULFILLED',
  'SHIPPED',
  'DELIVERED',
] as const;

export default function ShipmentDetailPage() {
  const { id } = useParams() as { id: string };

  const [item, setItem] = useState<ItemPayload | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/orders/item?id=${id}`);
        const data: ItemPayload | { error: string } = await res.json();
        if ('error' in data) throw new Error(data.error);
        setItem(data);
        setStatus(data.order?.status ?? '');
      } catch (err) {
        console.error('Failed to fetch item:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const updateStatus = (next: string) => setStatus(next);

  const handleSave = async () => {
    if (!item) return;
    const res = await fetch('/api/orders/item', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: item.id, status }),
    });
    const out = await res.json();
    if (res.ok) {
      alert(out.message || 'Order status updated');
      location.reload();
    } else {
      alert(out.error || 'Failed to update');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-20">Loading order item...</div>;
  }
  if (!item) {
    return <div className="text-center text-red-500 mt-20">Item not found</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <div className="flex justify-center mb-4">
        <span className="bg-white text-black px-6 py-2 rounded-full text-xl font-semibold border border-gray-400 shadow">
          Order Item ID [#{id}] – Shipment Management
        </span>
      </div>

      <div className="w-[800px] mx-auto bg-white border border-gray-300 rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <span className="bg-pink-100 text-pink-700 px-8 py-3 rounded-full text-xl font-semibold shadow-sm border border-pink-300">
            Order Status Flow for {item.productName || 'Unnamed Product'}
          </span>
        </div>

        <div className="mb-6 text-sm text-slate-700">
          <div className="font-semibold text-slate-900">
            Product: <span className="font-bold">{item.productName || 'Unnamed Product'}</span>
          </div>
          <div className="mt-1">
            Quantity: {item.quantity} • Region: {item.region} • Placed:{' '}
            {new Date(item.created_at).toLocaleString()}
          </div>
          <div className="mt-1">
            Current Status:{' '}
            <span className="font-semibold text-slate-900">{status || '—'}</span>
          </div>
        </div>

        <div className="relative flex gap-20">
          <div className="flex flex-col items-center gap-6">
            {ORDER_FLOW.map((s, i, arr) => (
              <div key={s} className="flex flex-col items-center">
                <Button
                  onClick={() => updateStatus(s)}
                  className={clsx('w-56 rounded-lg shadow-md', status === s ? pink : blue)}
                >
                  {s.replace(/_/g, ' ')}
                </Button>
                {i < arr.length - 1 && <span className="text-2xl text-gray-500">↓</span>}
              </div>
            ))}
          </div>

          <div className="absolute left-[15rem] space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-xl text-gray-500">→</span>
              <Button
                onClick={() => updateStatus('PAYMENT_FAILED')}
                className={clsx('w-52 rounded-lg shadow-md', status === 'PAYMENT_FAILED' ? pink : blue)}
              >
                PAYMENT FAILED
              </Button>
              <span className="text-xl text-gray-500">→</span>
              <Button
                onClick={() => updateStatus('CANCELED')}
                className={clsx('w-52 rounded-lg shadow-md', status === 'CANCELED' ? pink : blue)}
              >
                CANCELED
              </Button>
            </div>
          </div>

          <div className="absolute bottom-4 right-6 flex flex-col items-center gap-4">
            <Button
              onClick={() => updateStatus('RETURN_REQUESTED')}
              className={clsx('w-56 rounded-lg shadow-md', status === 'RETURN_REQUESTED' ? pink : blue)}
            >
              RETURN REQUESTED
            </Button>
            <span className="text-2xl text-gray-500">↓</span>
            <div className="flex gap-4">
              <Button
                onClick={() => updateStatus('REFUNDED')}
                className={clsx('w-40 rounded-lg shadow-md', status === 'REFUNDED' ? pink : blue)}
              >
                REFUNDED
              </Button>
              <Button
                onClick={() => updateStatus('NO_REFUND')}
                className={clsx('w-40 rounded-lg shadow-md', status === 'NO_REFUND' ? pink : blue)}
              >
                NO REFUND
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-12">
          <Button onClick={handleSave} className="bg-red-500 hover:bg-red-900 text-white px-6 py-3">
            Save Changes
          </Button>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1a4d5f] border border-black rounded-full shadow hover:bg-secondary hover:shadow-md transition duration-200"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
