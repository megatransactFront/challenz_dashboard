'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import Link from 'next/link';

const pink = 'bg-pink-400 text-white';
const blue = 'bg-slate-800 text-white';

export default function ShipmentDetailPage() {
  const { orderId } = useParams() as { orderId: string };

  const [order, setOrder] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [shipmentProvider, setShipmentProvider] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [returnDecision, setReturnDecision] = useState<'approve' | 'reject' | null>(null);
  const [returnReason, setReturnReason] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/orders?id=${orderId}`);
      const data = await res.json();
      const ord = data[0];
      setOrder(ord);
      setSelectedStatus(ord.status || '');
      setShipmentProvider(ord.shipmentProvider || '');
      setTrackingNumber(ord.trackingNumber || '');
      setExpectedDelivery(ord.expectedDelivery || '');
      setReturnDecision(ord.returnDecision || null);
      setReturnReason(ord.returnReason || '');

    };
    fetchOrder();
  }, [orderId]);

  const isActive = (status: string) => selectedStatus === status;
  const getColor = (status: string) => (isActive(status) ? pink : blue);

const handleSave = async () => {
  const updates: any = {};

  if (selectedStatus) {

    if (selectedStatus === 'RETURN_REQUESTED') {
      if (returnDecision === 'approve') {
        updates.status = 'REFUNDED';
      } else if (returnDecision === 'reject') {
        updates.status = 'NO_REFUND';
      } else {
        updates.status = 'RETURN_REQUESTED'; 
      }
      updates.returnDecision = returnDecision;
      updates.returnReason = returnReason;
    } else {
      updates.status = selectedStatus;
    }
  }

  if (shipmentProvider) updates.shipmentProvider = shipmentProvider;
  if (trackingNumber) updates.trackingNumber = trackingNumber;
  if (expectedDelivery) updates.expectedDelivery = expectedDelivery;

  const res = await fetch('/api/orders', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: orderId, updates }),
  });

  const result = await res.json();
  alert(result.message || 'Changes saved!');
  window.location.reload();
};

  if (!order) {
    return <div className="text-center text-gray-500 mt-20">Loading order...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-center mb-8">
        <span className="bg-white text-black px-6 py-2 rounded-full text-xl font-semibold border border-gray-400 shadow">
          Order #{orderId} - Shipment Management
        </span>
      </div>

      <div className="w-[800px] mx-auto center bg-white border border-gray-300 rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-10">
          <span className="bg-pink-100 text-pink-700 px-8 py-3 rounded-full text-xl font-semibold shadow-sm border border-pink-300">
            Order Status Flow
          </span>
        </div>

        <div className="relative flex gap-20">
          <div className="flex flex-col items-center gap-6">
            {['PENDING_PAYMENT', 'AWAITING_FULFILLMENT', 'FULFILLED', 'SHIPPED', 'DELIVERED'].map((status, i, arr) => (
              <div key={status} className="flex flex-col items-center">
                <Button
                  onClick={() => setSelectedStatus(status)}
                  className={clsx('w-56', getColor(status), 'rounded-lg shadow-md')}
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
                onClick={() => setSelectedStatus('PAYMENT_FAILED')}
                className={clsx('w-52', getColor('PAYMENT_FAILED'), 'rounded-lg shadow-md')}
              >
                PAYMENT FAILED
              </Button>
              <span className="text-xl text-gray-500">→</span>
              <Button
                onClick={() => setSelectedStatus('CANCELED')}
                className={clsx('w-52', getColor('CANCELED'), 'rounded-lg shadow-md')}
              >
                CANCELED
              </Button>
            </div>
          </div>

          <div className="absolute bottom-4 right-6 flex flex-col items-center gap-4">
            <Button
              onClick={() => setSelectedStatus('RETURN_REQUESTED')}
              className={clsx('w-56', getColor('RETURN_REQUESTED'), 'rounded-lg shadow-md')}
            >
              RETURN REQUESTED
            </Button>
            <span className="text-2xl text-gray-500">↓</span>
            <div className="flex gap-4">
              <Button
                onClick={() => setSelectedStatus('REFUNDED')}
                className={clsx('w-40', getColor('REFUNDED'), 'rounded-lg shadow-md')}
              >
                REFUNDED
              </Button>
              <Button
                onClick={() => setSelectedStatus('NO_REFUND')}
                className={clsx('w-40', getColor('NO_REFUND'), 'rounded-lg shadow-md')}
              >
                NO REFUND
              </Button>
            </div>
          </div>
        </div>
      </div>

      {selectedStatus === 'SHIPPED' && (
        <div className="w-[800px] mx-auto rounded-xl border border-gray-300 bg-white shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Shipment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-1">Shipment Provider</label>
              <select
                value={shipmentProvider}
                onChange={(e) => setShipmentProvider(e.target.value)}
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
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="rounded-md"
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium text-slate-700 mb-1">Expected Delivery Date</label>
              <Input
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      )}

      {selectedStatus === 'RETURN_REQUESTED' && (
        <div className="w-[800px] mx-auto rounded-xl border border-gray-300 bg-white shadow-lg p-6 space-y-6">
          <h3 className="text-xl font-semibold text-slate-800">Return Request Handling</h3>
          <div className="flex gap-4">
            <Button
              onClick={() => setReturnDecision('approve')}
              className={clsx(
                'w-32 rounded-md shadow',
                returnDecision === 'approve' ? 'bg-green-500 text-white' : 'bg-slate-800 text-white'
              )}
            >
              Approve
            </Button>
            <Button
              onClick={() => setReturnDecision('reject')}
              className={clsx(
                'w-32 rounded-md shadow',
                returnDecision === 'reject' ? 'bg-red-500 text-white' : 'bg-slate-800 text-white'
              )}
            >
              Reject
            </Button>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-1">Reason for Return (optional)</label>
            <Input
              placeholder="e.g., Wrong item delivered or damaged product"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="rounded-md"
            />
          </div>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3">
          Save Changes
        </Button>
      </div>

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
