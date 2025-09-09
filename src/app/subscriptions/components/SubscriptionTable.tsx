'use client';

import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

type Subscription = {
  id: string;
  user_id: string;
  service_id: string | null;
  status: 'PENDING_FIRST_PAYMENT' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'REFUNDED';
  start_date: string;      
  renewal_date: string;   
  uwc_held: number;
  price_usd: number;
  created_at: string;
  updated_at: string | null;
  services?: { name: string; image_url?: string } | null;
};

type Props = {
  search: string;
  status: string | null;
  startDate: string | null;
  endDate: string | null; // used as "renewal until" filter
};

const PAGE_SIZE = 10;

const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  CANCELED: 'bg-red-100 text-red-700',
  PAST_DUE: 'bg-orange-100 text-orange-700',
  PENDING_FIRST_PAYMENT: 'bg-yellow-100 text-yellow-700',
  REFUNDED: 'bg-pink-100 text-pink-700',
};

export const SubscriptionTable = ({ search, status, startDate, endDate }: Props) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filtered, setFiltered] = useState<Subscription[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/subscriptions');
        const data: Subscription[] = await res.json();
        setSubscriptions(data);
      } catch (err) {
        console.error('Failed to load subscriptions:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let result = [...subscriptions];

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter((sub) =>
        sub.id.toLowerCase().includes(lower) ||
        (sub.services?.name?.toLowerCase().includes(lower) ?? false)
      );
    }

    if (status) {
      result = result.filter((sub) => sub.status.toLowerCase() === status.toLowerCase());
    }

    if (startDate) {
      result = result.filter((sub) => new Date(sub.start_date) >= new Date(startDate));
    }

    // treat endDate prop as "renewal before/at" filter
    if (endDate) {
      result = result.filter((sub) => new Date(sub.renewal_date) <= new Date(endDate));
    }

    setFiltered(result);
    setPage(1);
  }, [search, status, startDate, endDate, subscriptions]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="overflow-auto border rounded-lg mt-6 min-h-[300px]">
      {loading ? (
        <div className="text-center py-10 text-sm text-gray-600">Loading subscriptions...</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscription ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>UWC Held</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Renewal Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-mono">{sub.id}</TableCell>
                  <TableCell>{sub.services?.name ?? '—'}</TableCell>
                  <TableCell>${Number(sub.price_usd ?? 0).toFixed(2)}/mo</TableCell>
                  <TableCell>{sub.uwc_held}</TableCell>
                  <TableCell>{new Date(sub.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(sub.renewal_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        statusStyles[sub.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {sub.status.replace(/_/g, ' ')}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(sub.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-6">No subscriptions found.</p>
          )}

          {filtered.length > PAGE_SIZE && (
            <div className="flex justify-center items-center gap-4 py-4">
              <Button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
