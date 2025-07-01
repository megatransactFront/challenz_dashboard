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
  id: number;
  user_id: string;
  plan_id: string;
  uwc_redeemed: number;
  amount_paid: number;
  start_date: string;
  end_date: string;
  status: string;
};

export const SubscriptionManager = () => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editForm, setEditForm] = useState({
    plan_id: '',
    uwc_redeemed: '',
    amount_paid: '',
    start_date: '',
    end_date: '',
    status: '',
  });

  const fetchSubscriptions = async () => {
    setLoading(true);
    const res = await fetch('/api/subscriptions');
    const json = await res.json();
    const all = Array.isArray(json) ? json : json.subscriptions || [];
    setSubs(all.sort((a: Subscription, b: Subscription) => b.id - a.id));
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to delete this subscription?');
    if (!confirm) return;
    await fetch(`/api/subscriptions?id=${id}`, { method: 'DELETE' });
    fetchSubscriptions();
  };

  const handleUpdate = async (id: number) => {
    const res = await fetch('/api/subscriptions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        plan_id: editForm.plan_id,
        uwc_redeemed: Number(editForm.uwc_redeemed),
        amount_paid: Number(editForm.amount_paid),
        start_date: editForm.start_date,
        end_date: editForm.end_date,
        status: editForm.status,
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
        sub.user_id.toLowerCase().includes(search.toLowerCase()) ||
        sub.plan_id.toLowerCase().includes(search.toLowerCase());
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
  const paginatedSubs = filteredSubs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            placeholder="Search by User ID or Plan ID"
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
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
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
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>UWC</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSubs.map((sub: any) => (
                    <TableRow key={sub.id}>
                      <TableCell>{sub.id}</TableCell>
                      <TableCell>{sub.user_id}</TableCell>
                      {editId === sub.id ? (
                        <>
                          <TableCell>
                            <Input
                              type="text"
                              value={editForm.plan_id}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, plan_id: e.target.value }))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="w-20"
                              value={editForm.uwc_redeemed}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, uwc_redeemed: e.target.value }))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="w-24"
                              value={editForm.amount_paid}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, amount_paid: e.target.value }))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <select
                              className="border px-2 py-1 rounded text-sm"
                              value={editForm.status}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, status: e.target.value }))
                              }
                            >
                              <option value="active">Active</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="expired">Expired</option>
                              <option value="pending">Pending</option>
                              <option value="refunded">Refunded</option>
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
                              <Button size="sm" onClick={() => handleUpdate(sub.id)}>Save</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{sub.plan_id}</TableCell>
                          <TableCell>{sub.uwc_redeemed}</TableCell>
                          <TableCell>${Number(sub.amount_paid).toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium
                              ${sub.status === 'active' ? 'bg-green-100 text-green-700'
                                : sub.status === 'cancelled' ? 'bg-red-100 text-red-700'
                                : sub.status === 'refunded' ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-800'}`}>
                              {sub.status}
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
                                  setEditId(sub.id);
                                  setEditForm({
                                    plan_id: sub.plan_id,
                                    uwc_redeemed: sub.uwc_redeemed,
                                    amount_paid: sub.amount_paid,
                                    start_date: sub.start_date,
                                    end_date: sub.end_date,
                                    status: sub.status,
                                  });
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(sub.id)}
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
