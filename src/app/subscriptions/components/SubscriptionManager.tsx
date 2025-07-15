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

type Subscription = {
  subscriptionid: string;
  userid: string;
  planid: string;
  status: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  payment_method: string;
  created_at: string;
  users: { username: string };
  plans: {
    name: string;
    services?: { name: string };
  };
};

export const SubscriptionManager = () => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editForm, setEditForm] = useState({
    status: '',
    start_date: '',
    end_date: '',
  });

  const fetchSubscriptions = async () => {
    setLoading(true);
    const res = await fetch('/api/subscriptions');
    const json = await res.json();
    const all = Array.isArray(json) ? json : json.subscriptions || [];
    setSubs(
      all.sort((a: Subscription, b: Subscription) =>
        b.subscriptionid.localeCompare(a.subscriptionid)
      )
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this subscription?');
    if (!confirm) return;
    await fetch(`/api/subscriptions?id=${id}`, { method: 'DELETE' });
    fetchSubscriptions();
  };

  const handleUpdate = async (subscriptionid: string) => {
    const res = await fetch('/api/subscriptions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscriptionid,
        status: editForm.status,
        start_date: editForm.start_date,
        end_date: editForm.end_date,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      alert(json.error || 'Failed to update subscription');
    } else {
      setEditId(null);
      fetchSubscriptions();
    }
  };

  const filteredSubs = useMemo(() => {
    return subs.filter((sub) => {
      const matchSearch =
        (sub.users?.username?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
        sub.subscriptionid.toLowerCase().includes(search.toLowerCase());

      const matchStatus = filterStatus ? sub.status === filterStatus : true;

      const matchStart = startDateFilter
        ? new Date(sub.start_date) >= new Date(startDateFilter)
        : true;

      const matchEnd = endDateFilter
        ? new Date(sub.end_date) <= new Date(endDateFilter)
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
            placeholder="Search by User ID or Sub ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />
          <select
            className="border px-2 py-1 rounded text-sm w-full md:w-1/3"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">By Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="CANCELED">CANCELED</option>
            <option value="PAST_DUE">PAST_DUE</option>
            <option value="PENDING_FIRST_PAYMENT">PENDING_FIRST_PAYMENT</option>
            <option value="REFUNDED">REFUNDED</option>
            <option value="CANCEL_AT_PERIOD_END">CANCEL_AT_PERIOD_END</option>
          </select>
          <Input
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            className="w-full md:w-1/3"
          />
          <Input
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            className="w-full md:w-1/3"
          />
          <Button
            variant="outline"
            className="text-sm"
            onClick={() => {
              setSearch('');
              setFilterStatus('');
              setStartDateFilter('');
              setEndDateFilter('');
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
                    <TableHead>User</TableHead>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSubs.map((sub) => (
                    <TableRow key={sub.subscriptionid}>
                      <TableCell>{sub.subscriptionid}</TableCell>
                      <TableCell>{sub.users?.username || sub.userid}</TableCell>
                      <TableCell>{sub.plans?.name || 'N/A'}</TableCell>
                      <TableCell>{sub.plans?.services?.name || 'N/A'}</TableCell>
                      <TableCell>{sub.payment_method || 'N/A'}</TableCell>

                      {editId === sub.subscriptionid ? (
                        <>
                          <TableCell>
                            <select
                              className="border px-2 py-1 rounded text-sm"
                              value={editForm.status}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, status: e.target.value }))
                              }
                            >
                              <option value="ACTIVE">ACTIVE</option>
                              <option value="CANCELED">CANCELED</option>
                              <option value="PAST_DUE">PAST_DUE</option>
                              <option value="PENDING_FIRST_PAYMENT">PENDING_FIRST_PAYMENT</option>
                              <option value="REFUNDED">REFUNDED</option>
                              <option value="CANCEL_AT_PERIOD_END">CANCEL_AT_PERIOD_END</option>
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
                              value={editForm.end_date}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, end_date: e.target.value }))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-center">
                              <Button size="sm" onClick={() => handleUpdate(sub.subscriptionid)}>
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
                                  : sub.status === 'CANCEL_AT_PERIOD_END'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {sub.status.replaceAll('_', ' ')}
                            </span>
                          </TableCell>
                          <TableCell>{sub.start_date}</TableCell>
                          <TableCell>{sub.end_date}</TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  setEditId(sub.subscriptionid);
                                  setEditForm({
                                    status: sub.status,
                                    start_date: sub.start_date,
                                    end_date: sub.end_date,
                                  });
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDelete(sub.subscriptionid)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
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
                disabled={currentPage === totalPages}
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
