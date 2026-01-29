// src/app/services_ID/add/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import ServiceForm from '../components/ServiceForm';

export default function AddServicePage() {
  const router = useRouter();
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-center">Add New Service</h1>
      <ServiceForm
        onSuccess={() => router.push('/services_ID')}
      />
    </div>
  );
}
