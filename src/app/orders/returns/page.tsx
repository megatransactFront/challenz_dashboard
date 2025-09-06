'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

type ReturnStatus = 'RETURN_REQUESTED' | 'REFUNDED' | 'NO_REFUND';

type ReturnListItem = {
  id: string;
  order_id: string;
  user_id: string | null;
  reason: string | null;
  status: ReturnStatus;
  created_at: string;
  item_count?: number;
  photo_count?: number;
};

type ReturnDetail = ReturnListItem & {
  items: {
    id: string;
    quantity: number;
    order_item_id: string;
    product?: { id: string; name: string | null; image_url: string | null };
  }[];
  photos: { id: string; url: string }[];
  admin_notes?: string | null;
};

const STATUS_BADGE: Record<ReturnStatus, { label: string; variant: string }> = {
  RETURN_REQUESTED: { label: 'Requested', variant: 'outline' },
  REFUNDED: { label: 'Refunded', variant: 'default' },
  NO_REFUND: { label: 'No refund', variant: 'destructive' },
};

export default function AdminReturnsPage() {
  const router = useRouter();

  const [statusTab, setStatusTab] = useState<'ALL' | ReturnStatus>('ALL');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ReturnListItem[]>([]);
  const [selected, setSelected] = useState<ReturnDetail | null>(null);
  const [saving, setSaving] = useState(false);

  const query = useMemo(() => {
    const sp = new URLSearchParams();
    if (statusTab !== 'ALL') sp.set('status', statusTab);
    if (search) sp.set('search', search);
    if (startDate) sp.set('startDate', startDate);
    if (endDate) sp.set('endDate', endDate);
    sp.set('limit', '50');
    return sp.toString();
  }, [statusTab, search, startDate, endDate]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/returns?${query}`);
      if (!res.ok) throw new Error('Failed to load returns');
      const data = await res.json();
      setRows(data?.returns ?? []);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (id: string) => {
    setSelected(null);
    try {
      const res = await fetch(`/api/returns/${id}`);
      if (!res.ok) throw new Error('Failed to load return');
      const data = await res.json();
      setSelected(data);
    } catch (e) {
      console.error(e);
      setSelected(null);
    }
  };

  const updateStatus = async (id: string, status: ReturnStatus) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/returns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update');
      // update table row
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      // update dialog data
      setSelected((d) => (d && d.id === id ? { ...d, status } : d));
    } catch (e) {
      console.error(e);
      alert('Could not update status. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => { load(); }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as any)}>
            <TabsList>
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value="RETURN_REQUESTED">Requested</TabsTrigger>
              <TabsTrigger value="REFUNDED">Refunded</TabsTrigger>
              <TabsTrigger value="NO_REFUND">No refund</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" onClick={() => router.push('/orders')}>
            Orders
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search by Return/Order ID or reason…"
            className="w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
          <Input
            type="date"
            value={endDate ?? ''}
            min={startDate ?? undefined}
            onChange={(e) => setEndDate(e.target.value || null)}
          />
          <Button variant="secondary" onClick={() => { setSearch(''); setStartDate(null); setEndDate(null); }}>
            Clear
          </Button>
        </div>
      </div>

      <Card className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading…
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Return</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Photos</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                    No return requests
                  </TableCell>
                </TableRow>
              ) : rows.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">{r.id.slice(0, 8)}</TableCell>
                  <TableCell className="font-mono text-xs">{r.order_id.slice(0, 8)}</TableCell>
                  <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
                  <TableCell>{r.item_count ?? '—'}</TableCell>
                  <TableCell>{r.photo_count ?? '—'}</TableCell>
                  <TableCell className="max-w-[260px] truncate" title={r.reason || ''}>
                    {r.reason || '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE[r.status].variant as any}>
                      {STATUS_BADGE[r.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => openDetail(r.id)}>
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Return #{r.id.slice(0, 8)}</DialogTitle>
                        </DialogHeader>

                        {!selected || selected.id !== r.id ? (
                          <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Loading details…
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                              Order <span className="font-mono">{selected.order_id.slice(0, 8)}</span> •
                              &nbsp;Created {new Date(selected.created_at).toLocaleString()}
                            </div>

                            <div className="space-y-2">
                              <div className="font-medium">Items</div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {selected.items.map((it) => (
                                  <div key={it.id} className="flex gap-3 items-center p-2 border rounded-md">
                                    {it.product?.image_url ? (
                                      <img
                                        src={it.product.image_url}
                                        alt={it.product?.name ?? 'Item'}
                                        className="w-12 h-12 rounded object-cover"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 rounded bg-gray-200" />
                                    )}
                                    <div className="text-sm">
                                      <div className="font-medium">{it.product?.name ?? it.order_item_id}</div>
                                      <div className="text-muted-foreground">Qty: {it.quantity}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="font-medium">Reason</div>
                              <div className="text-sm whitespace-pre-wrap">{selected.reason || '—'}</div>
                            </div>

                            <div className="space-y-2">
                              <div className="font-medium">Photos</div>
                              {selected.photos.length ? (
                                <div className="flex flex-wrap gap-2">
                                  {selected.photos.map((p) => (
                                    <img key={p.id} src={p.url} alt="Return photo" className="w-24 h-24 rounded object-cover" />
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">No photos</div>
                              )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <Button
                                variant="outline"
                                disabled={saving || selected.status === 'NO_REFUND'}
                                onClick={() => updateStatus(selected.id, 'NO_REFUND')}
                              >
                                {saving && selected.status !== 'NO_REFUND' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Mark No refund
                              </Button>
                              <Button
                                disabled={saving || selected.status === 'REFUNDED'}
                                onClick={() => updateStatus(selected.id, 'REFUNDED')}
                              >
                                {saving && selected.status !== 'REFUNDED' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Approve refund
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
