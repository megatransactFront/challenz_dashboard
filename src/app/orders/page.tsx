'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { OrderSummaryCards } from './components/OrderSummaryCards';
import { OrderTable } from './components/OrderTable';
import { FilterDropdown } from './components/FilterDropdown';

export default function OrdersPage() {
  const [tab, setTab] = useState<'summary' | 'perUser'>('summary');
  const [status, setStatus] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-8 space-y-6">
      
      <div className="flex justify-between items-center">
        <Tabs value={tab} onValueChange={(val) => setTab(val as any)}>
          <TabsList>
            <TabsTrigger value="summary">Total Order Summary</TabsTrigger>
            <TabsTrigger value="perUser">Order Per User</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {tab === 'summary' && <OrderSummaryCards />}

      {tab === 'perUser' && (
        <Card className="p-4 md:p-6 space-y-4">
         <div className="flex justify-center mb-8">
          <span className="bg-white text-black px-6 py-2 rounded-full text-xl font-semibold border border-gray-400 shadow">
            Order Per User
          </span>
        </div>
          <div className="flex flex-col md:flex-row flex-wrap gap-4 w-full items-end">
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-sm text-gray-600">Search</label>
              <Input
                placeholder="Search by Customer/Order ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <FilterDropdown
            label="Status"
            value={status}
            onChange={setStatus}
            options={['PENDING_PAYMENT', 'AWAITING_FULFILLMENT' , 'FULFILLED' , 'SHIPPED' , 'DELIVERED' , 'PAYMENT_FAILED' , 'CANCELED' , 'RETURN_REQUESTED' , 'REFUNDED', 'NO_REFUND']}
            widthClass="w-full"
            />


            <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
              <label className="text-sm text-gray-600">Start Date</label>
              <Input
                type="date"
                value={startDate ?? ''}
                onChange={(e) => {
                  const val = e.target.value || null;
                  setStartDate(val);
                  if (endDate && val && new Date(endDate) < new Date(val)) {
                    setEndDate(val);
                  }
                }}
              />
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
              <label className="text-sm text-gray-600">End Date</label>
              <Input
                type="date"
                value={endDate ?? ''}
                min={startDate ?? undefined}
                onChange={(e) => setEndDate(e.target.value || null)}
              />
            </div>

            <div className="flex flex-col gap-1 min-w-[100px]">
              <label className="text-sm text-transparent">Clear</label>
              <button
                onClick={() => {
                  setSearch('');
                  setStatus(null);
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded w-full"
              >
                Clear
              </button>
            </div>
          </div>

          <OrderTable
            search={search}
            status={status}
            startDate={startDate}
            endDate={endDate}
          />
        </Card>
      )}
    </div>
  );
}
