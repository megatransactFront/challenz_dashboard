'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

type FlashSale = {
  flashsalesid: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  created_at: string;
};

export default function FlashSalesPage() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
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

    fetchFlashSales();
  }, []);

if (loading)
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Flash Sales</h1>
      <ul className="space-y-4">
        {flashSales.map((sale) => (
          <li
            key={sale.flashsalesid}
            className="border p-4 rounded shadow hover:bg-gray-100 transition"
          >
            <Link href={`/sales/${sale.flashsalesid}`}>
              <div className="cursor-pointer">
                <h2 className="text-lg font-semibold">{sale.name}</h2>
                <p className="text-sm text-gray-600">{sale.description}</p>
                <p className="text-sm mt-1">
                  {new Date(sale.start_time).toLocaleString()} →{' '}
                  {new Date(sale.end_time).toLocaleString()}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
