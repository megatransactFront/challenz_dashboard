'use client';

import { useEffect, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

type SubscriptionStatus =
  | 'PENDING_FIRST_PAYMENT'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'REFUNDED';

type Subscription = {
  id: string;
  user_id: string;
  service_id: string | null;
  status: SubscriptionStatus;
  start_date: string;      // YYYY-MM-DD
  renewal_date: string;    // YYYY-MM-DD
  uwc_held: number;
  price_usd: number;
  created_at: string;
  updated_at: string | null;
  services?: { id: string; name: string; image_url?: string } | null; // joined
};

export const SubscriptionManager = () => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // filters + paging
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'' | SubscriptionStatus>('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState(''); // used as "renewal before/at"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // edit form
  const [editForm, setEditForm] = useState<{
    status: SubscriptionStatus | '';
    start_date: string;
    renewal_date: string;
  }>({
    status: '',
    start_date: '',
    renewal_date: '',
  });

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/subscriptions');
      const json = await res.json();
      const all: Subscription[] = Array.isArray(json) ? json : json.subscriptions || [];
      setSubs(all);
    } catch (e) {
      console.error('Failed to load subscriptions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this subscription?');
    if (!confirm) return;
    const res = await fetch(`/api/subscriptions?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || 'Failed to delete subscription');
      return;
    }
    fetchSubscriptions();
  };

  const handleUpdate = async (id: string) => {
    const res = await fetch('/api/subscriptions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        status: editForm.status,
        start_date: editForm.start_date,
        renewal_date: editForm.renewal_date,
      }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(json.error || 'Failed to update subscription');
    } else {
      setEditId(null);
      fetchSubscriptions();
    }
  };

  const filteredSubs = useMemo(() => {
    return subs.filter((sub) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        sub.id.toLowerCase().includes(q) ||
        sub.user_id.toLowerCase().includes(q) ||
        (sub.services?.name?.toLowerCase().includes(q) ?? false);

      const matchStatus = filterStatus ? sub.status === filterStatus : true;

      const matchStart = startDateFilter
        ? new Date(sub.start_date) >= new Date(startDateFilter)
        : true;

      // Treat endDateFilter as "renewal date before/at"
      const matchEnd = endDateFilter
        ? new Date(sub.renewal_date) <= new Date(endDateFilter)
        : true;

      return matchSearch && matchStatus && matchStart && matchEnd;
    });
  }, [subs, search, filterStatus, startDateFilter, endDateFilter]);

  const totalPages = Math.ceil(filteredSubs.length / itemsPerPage);
  const paginatedSubs = filteredSubs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 mt-6">
      <Card className="p-4 space-y-4">
        <div className="flex justify-center mb-6">
          <span className="bg-white text-black px-6 py-2 rounded-full text-xl font-semibold border border-gray-300 shadow">
            All Subscriptions
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
          <Input
            placeholder="Search by Sub ID, User ID, or Service"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/3"
          />

          <select
            className="border px-2 py-1 rounded text-sm w-full md:w-1/4"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as SubscriptionStatus | '');
              setCurrentPage(1);
            }}
          >
            <option value="">By Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="CANCELED">CANCELED</option>
            <option value="PAST_DUE">PAST_DUE</option>
            <option value="PENDING_FIRST_PAYMENT">PENDING_FIRST_PAYMENT</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>

          <Input
            type="date"
            value={startDateFilter}
            onChange={(e) => {
              setStartDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/4"
          />
          <Input
            type="date"
            value={endDateFilter}
            onChange={(e) => {
              setEndDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/4"
          />

          <Button
            variant="outline"
            className="text-sm"
            onClick={() => {
              setSearch('');
              setFilterStatus('');
              setStartDateFilter('');
              setEndDateFilter('');
              setCurrentPage(1);
            }}
          >
            Clear Filters
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
            <span className="ml-2 text-gray-600">Loading subscriptions...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border">
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow className="bg-slate-100 text-slate-700">
                    <TableHead>Sub ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>UWC Held</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>Renewal</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSubs.map((sub) => {
                    const isEditing = editId === sub.id;
                    return (
                      <TableRow key={sub.id}>
                        <TableCell className="font-mono">{sub.id}</TableCell>
                        <TableCell className="font-mono">{sub.user_id}</TableCell>
                        <TableCell>{sub.services?.name ?? '—'}</TableCell>
                        <TableCell>${Number(sub.price_usd ?? 0).toFixed(2)}/mo</TableCell>
                        <TableCell>{sub.uwc_held}</TableCell>

                        {isEditing ? (
                          <>
                            <TableCell>
                              <select
                                className="border px-2 py-1 rounded text-sm"
                                value={editForm.status}
                                onChange={(e) =>
                                  setEditForm((f) => ({
                                    ...f,
                                    status: e.target.value as SubscriptionStatus,
                                  }))
                                }
                              >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="CANCELED">CANCELED</option>
                                <option value="PAST_DUE">PAST_DUE</option>
                                <option value="PENDING_FIRST_PAYMENT">PENDING_FIRST_PAYMENT</option>
                                <option value="REFUNDED">REFUNDED</option>
                              </select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={editForm.start_date}
                                onChange={(e) =>
                                  setEditForm((f) => ({ ...f, start_date: e.target.value }))
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={editForm.renewal_date}
                                onChange={(e) =>
                                  setEditForm((f) => ({ ...f, renewal_date: e.target.value }))
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2 justify-center">
                                <Button size="sm" onClick={() => handleUpdate(sub.id)}>
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditId(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
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
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : sub.status === 'REFUNDED'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {sub.status.replaceAll('_', ' ')}
                              </span>
                            </TableCell>
                            <TableCell>{sub.start_date}</TableCell>
                            <TableCell>{sub.renewal_date}</TableCell>
                            <TableCell>
                              <div className="flex gap-2 justify-center">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => {
                                    setEditId(sub.id);
                                    setEditForm({
                                      status: sub.status,
                                      start_date: sub.start_date,
                                      renewal_date: sub.renewal_date,
                                    });
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleDelete(sub.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
