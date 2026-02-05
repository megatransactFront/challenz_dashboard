'use client';

import Image from 'next/image';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Minus, Plus, Save, Search, AlertTriangle } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  region: 'NZ' | 'AU' | 'US';
  price_usd: number;
  stock: number | null;
  is_active: boolean | null;
  image_url: string | null;
};

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

const regionOptions = [
  { value: '', label: 'All Countries' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'AU', label: 'Australia' },
  { value: 'US', label: 'United States' },
];

function StockPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [region, setRegion] = useState<string>(params.get('region') || '');
  const [q, setQ] = useState<string>(params.get('q') || '');
  const [onlyLow, setOnlyLow] = useState<boolean>(false);
  const [lowThreshold, setLowThreshold] = useState<number>(20);

  const [products, setProducts] = useState<Product[]>([]);
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState<number>(Number(params.get('page') || 1));
  const [onlyActive, setOnlyActive] = useState<boolean>(false); 
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10
  });

  const isLow = (value: number) => value <= lowThreshold;
  const isOut = (value: number) => value === 0;

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set('page', String(page));
    sp.set('limit', '10');
    if (region) sp.set('region', region);
    if (q) sp.set('q', q);
    if (onlyLow) {
      sp.set('onlyLow', '1');
      sp.set('lowThreshold', String(lowThreshold));
    }
    if (onlyActive) sp.set('onlyActive', '1');
    return sp.toString();
  }, [page, region, q, onlyLow, lowThreshold, onlyActive]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?${queryString}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // reflect URL
  useEffect(() => {
    router.replace(`/products/stock?${queryString}`);
  }, [queryString, router]);

  const updateEdit = (id: string, val: number) => {
    setEdits(prev => ({ ...prev, [id]: Math.max(0, val|0) }));
  };

  const applyDelta = (id: string, delta: number) => {
    const current = edits[id] ?? products.find(p => p.id === id)?.stock ?? 0;
    updateEdit(id, Math.max(0, current + delta));
  };

  const saveOne = async (id: string) => {
    const value = edits[id];
    if (value == null) return;
    if (value === 0) {
      alert('Stock 0 not allowed. Use "Mark Inactive" or delete.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: value }),
      });
      if (!res.ok) throw new Error('Update failed');
      setProducts(cur => cur.map(p => (p.id === id ? { ...p, stock: value } as Product : p)));
      setEdits(prev => {
        const rest = { ...prev };
        delete rest[id];
        return rest;
      });
       alert("Stock updated successfully ✅");
    } catch {
      alert('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const saveBulk = async () => {
    const payload = Object.entries(edits).map(([id, stock]) => ({ id, stock }));
    if (!payload.length) return;
    setSaving(true);
    try {
      const res = await fetch('/api/products/bulk-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: payload }),
      });
      if (!res.ok) throw new Error('Bulk update failed');
      await fetchProducts();
      setEdits({});
      alert("All stock changes saved successfully ✅");
    } catch {
      alert('Bulk save failed.');
    } finally {
      setSaving(false);
    }
  };

  const markInactive = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: false }),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchProducts();
    } catch {
      alert('Failed to mark inactive');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Country:</label>
                <select
                  value={region}
                  onChange={(e) => { setRegion(e.target.value); setPage(1); }}
                  className="border rounded px-3 py-2"
                >
                  {regionOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(1); }}
                  placeholder="Search product name…"
                  className="w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="onlyLow"
                  type="checkbox"
                  checked={onlyLow}
                  onChange={(e) => { setOnlyLow(e.target.checked); setPage(1); }}
                />
                <label htmlFor="onlyLow" className="text-sm">Only low-stock</label>
                <Input
                type="number"
                value={lowThreshold}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setLowThreshold(isNaN(val) ? 0 : Math.max(0, val));
                    setPage(1);
                }}
                className="w-20"
                />
                <div className="flex items-center gap-2">
                <input
                  id="onlyActive"
                  type="checkbox"
                  checked={onlyActive}
                  onChange={(e) => { setOnlyActive(e.target.checked); setPage(1); }}
                />
                <label htmlFor="onlyActive" className="text-sm">Only active</label>
              </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/products')}>Back to Products</Button>
              <Button onClick={saveBulk} disabled={saving || !Object.keys(edits).length}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save All
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">PRODUCT</th>
                      <th className="text-left py-3 px-4">REGION</th>
                      <th className="text-left py-3 px-4">PRICE</th>
                      <th className="text-left py-3 px-4">STOCK</th>
                      <th className="text-left py-3 px-4">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const original = p.stock ?? 0;
                      const edited = edits[p.id];
                      const value = edited == null ? original : edited;
                      const low = isLow(value);
                      const out = isOut(value);

                      return (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {p.image_url ? (
                                <Image src={p.image_url} alt={p.name} width={40} height={40} className="w-10 h-10 rounded object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded bg-gray-200" />
                              )}
                              <div className="flex flex-col">
                                <span className="font-medium">{p.name}</span>
                                {!p.is_active && <span className="text-xs text-gray-500">Inactive</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{p.region}</td>
                          <td className="py-3 px-4">${p.price_usd.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" onClick={() => applyDelta(p.id, -1)}>
                                <Minus className="w-4 h-4" />
                              </Button>
                              <Input
                                type="number"
                                value={value}
                                onChange={(e) => updateEdit(p.id, parseInt(e.target.value) || 0)}
                                className="w-20"
                                min={0}
                              />
                              <Button variant="outline" size="icon" onClick={() => applyDelta(p.id, +1)}>
                                <Plus className="w-4 h-4" />
                              </Button>

                              {out ? (
                                <span className="inline-flex items-center text-red-600 text-xs ml-2">
                                  Out
                                </span>
                              ) : low ? (
                                <span className="inline-flex items-center text-amber-600 text-xs ml-2">
                                  <AlertTriangle className="w-4 h-4 mr-1" /> Low
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" onClick={() => saveOne(p.id)} disabled={saving}>
                                Save
                              </Button>
                              {value === 0 ? (
                                <Button variant="destructive" onClick={() => markInactive(p.id)} disabled={saving}>
                                  Mark Inactive
                                </Button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StockPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    }>
      <StockPageContent />
    </Suspense>
  );
}
