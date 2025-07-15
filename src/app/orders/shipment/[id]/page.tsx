'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import Link from 'next/link';

const pink = 'bg-pink-400 text-white';
const blue = 'bg-slate-800 text-white';

type OrderItem = {
  id: string;
  productName: string;
  status: string;
  shipmentProvider?: string;
  trackingNumber?: string;
  expectedDelivery?: string;
  returnDecision?: 'approve' | 'reject' | null;
  returnReason?: string;
};

export default function ShipmentDetailPage() {
  const { id } = useParams() as { id: string };
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/orders/item?id=${id}`);
        const data = await res.json();

        if (!data || data.error) throw new Error(data.error || 'Not found');

        const item: OrderItem = {
          id: data.id,
          productName: data.products?.name || 'Unnamed Product',
          status: data.status || '',
          shipmentProvider: data.shipmentProvider || '',
          trackingNumber: data.trackingNumber || '',
          expectedDelivery: data.expectedDelivery || '',
          returnDecision: data.returnDecision || null,
          returnReason: data.returnReason || '',
        };

        setItems([item]);
      } catch (err) {
        console.error('Failed to fetch item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const updateItem = (id: string, changes: Partial<OrderItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  };

  const handleSave = async () => {
    const updates = items.map((item) => {
      const update: any = {
        id: item.id,
        status: item.status,
        shipmentProvider: item.shipmentProvider || null,
        trackingNumber: item.trackingNumber || null,
        expectedDelivery: item.expectedDelivery || null,
        returnReason: item.returnReason || null,
        returnDecision: item.returnDecision || null,
      };

      if (item.status === 'RETURN_REQUESTED') {
        if (item.returnDecision === 'approve') update.status = 'REFUNDED';
        else if (item.returnDecision === 'reject') update.status = 'NO_REFUND';
      }

      return update;
    });

    const res = await fetch('/api/orders/item', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: updates }),
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message || 'Changes saved!');
      window.location.reload();
    } else {
      console.error('Save error:', result);
      alert(result.error || 'Failed to save changes.');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-20">Loading order item...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <div className="flex justify-center mb-4">
        <span className="bg-white text-black px-6 py-2 rounded-full text-xl font-semibold border border-gray-400 shadow">
          Order Item ID [#{id}] – Shipment Management
        </span>
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          className="w-[800px] mx-auto bg-white border border-gray-300 rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            {item.productName}
          </h3>

          <div className="flex justify-center mb-6">
            <span className="bg-pink-100 text-pink-700 px-8 py-3 rounded-full text-xl font-semibold shadow-sm border border-pink-300">
              Order Status Flow
            </span>
          </div>

          <div className="relative flex gap-20">
            <div className="flex flex-col items-center gap-6">
              {['PENDING_PAYMENT', 'AWAITING_FULFILLMENT', 'FULFILLED', 'SHIPPED', 'DELIVERED'].map((status, i, arr) => (
                <div key={status} className="flex flex-col items-center">
                  <Button
                    onClick={() => updateItem(item.id, { status })}
                    className={clsx('w-56', item.status === status ? pink : blue, 'rounded-lg shadow-md')}
                  >
                    {status.replace('_', ' ')}
                  </Button>
                  {i < arr.length - 1 && <span className="text-2xl text-gray-500">↓</span>}
                </div>
              ))}
            </div>

            <div className="absolute left-[15rem] space-y-8">
              <div className="flex items-center gap-3">
                <span className="text-xl text-gray-500">→</span>
                <Button
                  onClick={() => updateItem(item.id, { status: 'PAYMENT_FAILED' })}
                  className={clsx('w-52', item.status === 'PAYMENT_FAILED' ? pink : blue, 'rounded-lg shadow-md')}
                >
                  PAYMENT FAILED
                </Button>
                <span className="text-xl text-gray-500">→</span>
                <Button
                  onClick={() => updateItem(item.id, { status: 'CANCELED' })}
                  className={clsx('w-52', item.status === 'CANCELED' ? pink : blue, 'rounded-lg shadow-md')}
                >
                  CANCELED
                </Button>
              </div>
            </div>

            <div className="absolute bottom-4 right-6 flex flex-col items-center gap-4">
              <Button
                onClick={() => updateItem(item.id, { status: 'RETURN_REQUESTED' })}
                className={clsx('w-56', item.status === 'RETURN_REQUESTED' ? pink : blue, 'rounded-lg shadow-md')}
              >
                RETURN REQUESTED
              </Button>
              <span className="text-2xl text-gray-500">↓</span>
              <div className="flex gap-4">
                <Button
                  onClick={() =>
                    updateItem(item.id, {
                      status: 'REFUNDED',
                      returnDecision: 'approve'
                    })
                  }
                  className={clsx('w-40', item.status === 'REFUNDED' ? pink : blue, 'rounded-lg shadow-md')}
                >
                  REFUNDED
                </Button>
                <Button
                  onClick={() =>
                    updateItem(item.id, {
                      status: 'NO_REFUND',
                      returnDecision: 'reject'
                    })
                  }
                  className={clsx('w-40', item.status === 'NO_REFUND' ? pink : blue, 'rounded-lg shadow-md')}
                >
                  NO REFUND
                </Button>
              </div>
            </div>
          </div>

          {item.status === 'SHIPPED' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-1">Shipment Provider</label>
                <select
                  value={item.shipmentProvider}
                  onChange={(e) => updateItem(item.id, { shipmentProvider: e.target.value })}
                  className="rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-pink-400"
                >
                  <option value="" disabled>Select provider</option>
                  <option value="DHL">DHL</option>
                  <option value="AusPost">AusPost</option>
                  <option value="FedEx">FedEx</option>
                  <option value="TNT">TNT</option>
                  <option value="Aramex">Aramex</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-1">Tracking Number</label>
                <Input
                  placeholder="e.g., 1234567890"
                  value={item.trackingNumber}
                  onChange={(e) => updateItem(item.id, { trackingNumber: e.target.value })}
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-medium text-slate-700 mb-1">Expected Delivery</label>
                <Input
                  type="date"
                  value={item.expectedDelivery || ''}
                  onChange={(e) => updateItem(item.id, { expectedDelivery: e.target.value })}
                />
              </div>
            </div>
          )}

          {item.status === 'RETURN_REQUESTED' && (
            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold text-slate-800">Return Request Handling</h3>
              <div className="flex gap-4">
                <Button
                  onClick={() => updateItem(item.id, { returnDecision: 'approve' })}
                  className={clsx('w-32 rounded-md shadow', item.returnDecision === 'approve' ? 'bg-green-500 text-white' : blue)}
                >
                  Approve
                </Button>
                <Button
                  onClick={() => updateItem(item.id, { returnDecision: 'reject' })}
                  className={clsx('w-32 rounded-md shadow', item.returnDecision === 'reject' ? 'bg-red-500 text-white' : blue)}
                >
                  Reject
                </Button>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-1">Reason for Return (optional)</label>
                <Input
                  placeholder="e.g., Wrong item delivered"
                  value={item.returnReason}
                  onChange={(e) => updateItem(item.id, { returnReason: e.target.value })}
                />
              </div>
            </div>
          )}

          {['REFUNDED', 'NO_REFUND'].includes(item.status) && (
            <div className="mt-6 space-y-2 border-t pt-4">
              <h3 className="text-lg font-semibold text-slate-800">Return Summary</h3>
              {item.returnDecision && (
                <p className="text-sm text-slate-700">
                  <strong>Decision:</strong>{' '}
                  <span className={clsx(
                    'font-semibold',
                    item.returnDecision === 'approve' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {item.returnDecision.toUpperCase()}
                  </span>
                </p>
              )}
              {item.returnReason && (
                <p className="text-sm text-slate-700">
                  <strong>Reason:</strong> {item.returnReason}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-center gap-6 mt-10">
        <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3">
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
  );
}
