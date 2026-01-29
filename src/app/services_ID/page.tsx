// src/app/services_ID/page.tsx
'use client';
import { useState } from 'react';
import ServiceListPage from './list/page';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ServicesPage() {
  const router = useRouter();
  const [region, setRegion] = useState('');

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Countries</option>
          <option value="AU">Australia</option>
          <option value="NZ">New Zealand</option>
          <option value="US">United States</option>
        </select>
        <Button onClick={() => router.push('/services_ID/add')}>
          Add Service
        </Button>
      </div>
      <ServiceListPage region={region} />
    </div>
  );
}
