'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

type Subscription = {
  id: number;
  user_id: string;
  plan_id: string;
  uwc_redeemed: number;
  amount_paid: number;
  start_date: string;
  end_date: string;
  status: string;
};

type Props = {
  search: string;
  status: string | null;
  startDate: string | null;
  endDate: string | null;
};

const PAGE_SIZE = 10;

export const SubscriptionTable = ({
  search,
  status,
  startDate,
  endDate,
}: Props) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filtered, setFiltered] = useState<Subscription[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch('/api/subscriptions');
      const json = await res.json();
      const all = Array.isArray(json) ? json : json.subscriptions || [];
      setSubscriptions(all.sort((a: Subscription, b: Subscription) => b.id - a.id));
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...subscriptions];

    if (search) {
      result = result.filter(
        (sub) =>
          sub.user_id.toLowerCase().includes(search.toLowerCase()) ||
          String(sub.id).includes(search)
      );
    }

    if (status) {
      result = result.filter((sub) => sub.status === status);
    }

    if (startDate) {
      result = result.filter(
        (sub) => new Date(sub.start_date) >= new Date(startDate)
      );
    }

    if (endDate) {
      result = result.filter(
        (sub) => new Date(sub.end_date) <= new Date(endDate)
      );
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
                <TableHead>Sub ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Plan ID</TableHead>
                <TableHead>UWC</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>{sub.id}</TableCell>
                  <TableCell>{sub.user_id}</TableCell>
                  <TableCell>{sub.plan_id}</TableCell>
                  <TableCell>{sub.uwc_redeemed}</TableCell>
                  <TableCell>${sub.amount_paid.toFixed(2)}</TableCell>
                  <TableCell>{sub.start_date}</TableCell>
                  <TableCell>{sub.end_date}</TableCell>
                  <TableCell>
                    <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      sub.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : sub.status === 'CANCELED'
                      ? 'bg-red-100 text-red-700'
                      : sub.status === 'PAST_DUE'
                      ? 'bg-orange-100 text-orange-700'
                      : sub.status === 'PENDING_FIRST_PAYMENT'
                      ? 'bg-yellow-100 text-yellow-700'
                      : sub.status === 'REFUNDED'
                      ? 'bg-pink-100 text-pink-700'
                      : sub.status === 'CANCEL_AT_PERIOD_END'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-800'
                      }`}
                      >
                        {sub.status}
                      </span>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-6">
              No subscriptions found.
            </p>
          )}

          {filtered.length > PAGE_SIZE && (
            <div className="flex justify-center items-center gap-4 py-4">
              <Button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
