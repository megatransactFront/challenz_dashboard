'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ServiceForm() {
  const [formData, setFormData] = useState({
    region: '',
    name: '',
    description: '',
    standardPrice: '',
    discountedPrice: '',
    duration_months: '',
    uwaciCoinsRequired: '',
    cancellationPolicy: '',
    minimum_term: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/services_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: crypto.randomUUID(), // generate unique ID for Supabase
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to create service');
      }

      setSuccess('Service created successfully!');
      setFormData({
        region: '',
        name: '',
        description: '',
        standardPrice: '',
        discountedPrice: '',
        duration_months: '',
        uwaciCoinsRequired: '',
        cancellationPolicy: '',
        minimum_term: '',
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="p-8">
          <h1 className="text-2xl font-semibold mb-6 text-center">Add New Service</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Service Name"
              required
            />
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
            <Input
              name="standardPrice"
              value={formData.standardPrice}
              onChange={handleChange}
              placeholder="Standard Price ($)"
              type="number"
              required
            />
            <Input
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleChange}
              placeholder="Discounted Price ($)"
              type="number"
            />
            <Input
              name="duration_months"
              value={formData.duration_months}
              onChange={handleChange}
              placeholder="Duration (Months)"
              type="number"
              required
            />
            <Input
              name="uwaciCoinsRequired"
              value={formData.uwaciCoinsRequired}
              onChange={handleChange}
              placeholder="Uwaci Coins Required"
              type="number"
              required
            />
            <Textarea
              name="cancellationPolicy"
              value={formData.cancellationPolicy}
              onChange={handleChange}
              placeholder="Cancellation Policy"
            />
            <Input
              name="minimum_term"
              value={formData.minimum_term}
              onChange={handleChange}
              placeholder="Minimum Term (Months)"
              type="number"
              required
            />
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-sm bg-white"
            >
              <option value="">Select Region</option>
              <option value="AU">Australia</option>
              <option value="NZ">New Zealand</option>
              <option value="US">United States</option>
            </select>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-600 text-sm text-center">{success}</p>}

            <div className="flex justify-center pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
