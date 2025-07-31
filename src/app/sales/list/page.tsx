'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { FlashSale } from '@/app/types/flashsale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function FlashSalesPage() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlashSale, setSelectedFlashSale] = useState<FlashSale | null>(null);
  const [formData, setFormData] = useState<Partial<FlashSale>>({});
  const [saving, setSaving] = useState(false);

  const fetchFlashSales = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sales');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      setFlashSales(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashSales();
  }, []);

  const handleSave = async () => {
    if (!selectedFlashSale) return;

    try {
      setSaving(true);
      const res = await fetch(`/api/sales/${selectedFlashSale.flashsalesid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Update failed');
      await fetchFlashSales();
      setSelectedFlashSale(null);
    } catch (err) {
      alert('Failed to save flash sale');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFlashSale) return;
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/sales/${selectedFlashSale.flashsalesid}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error('Failed to delete product');
      fetchFlashSales();
      setSelectedFlashSale(null)
    } catch (err) {
      alert("Delete failed.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );

  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Flash Sales</h1>
      <ul className="space-y-4">
        {flashSales.map((sale) => (
          <li
            key={sale.flashsalesid}
            className="border p-4 rounded shadow hover:bg-gray-100 transition"
          >
            <div className="flex justify-between items-center">
              <Link href={`/sales/${sale.flashsalesid}`} className="flex-1">
                <div className="cursor-pointer">
                  <h2 className="text-lg font-semibold">{sale.name}</h2>
                  <p className="text-sm text-gray-600">{sale.description}</p>
                  <p className="text-sm mt-1">
                    {new Date(sale.start_time).toLocaleString()} →{' '}
                    {new Date(sale.end_time).toLocaleString()}
                  </p>
                </div>
              </Link>
              <Button
                onClick={() => {
                  setSelectedFlashSale(sale);
                  setFormData(sale);
                }}
              >
                Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={!!selectedFlashSale} onOpenChange={(open) => !open && setSelectedFlashSale(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Flash Sale</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Flash Sale Name"
            />
            <Input
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
            />
            <Input
              type="datetime-local"
              value={formData.start_time?.slice(0, 16) || ''}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            />
            <Input
              type="datetime-local"
              value={formData.end_time?.slice(0, 16) || ''}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedFlashSale(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
