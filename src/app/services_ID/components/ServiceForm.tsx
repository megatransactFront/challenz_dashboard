// src/app/services_ID/components/ServiceForm.tsx
'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ServiceForm({
  initialData,
  onSuccess,
  isEdit = false,
}: {
  initialData?: any
  onSuccess: () => void
  isEdit?: boolean
}) {
  const [formData, setFormData] = useState(initialData || {
    name: '', region: '', description: '',
    standardPrice: '', discountedPrice: '',
    duration_months: '', uwaciCoinsRequired: '',
    cancellationPolicy: '', minimum_term: '',
    is_active: true,                    // ⬅️ NEW
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...formData,
        ...(isEdit ? {} : { id: crypto.randomUUID() }),
        // numeric coercion to keep API clean
        standardPrice: parseFloat(formData.standardPrice) || 0,
        discountedPrice: formData.discountedPrice === '' ? null : (parseFloat(formData.discountedPrice) || 0),
        duration_months: parseInt(formData.duration_months) || 0,
        uwaciCoinsRequired: parseInt(formData.uwaciCoinsRequired) || 0,
        minimum_term: parseInt(formData.minimum_term) || 0,
      }
      const res = await fetch(
        isEdit ? `/api/services_ID/${payload.id}` : '/api/services_ID',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Service Name" value={formData.name} onChange={handleChange} required />
          <Textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          <Input name="standardPrice" type="number" placeholder="Standard Price" value={formData.standardPrice} onChange={handleChange} />
          <Input name="discountedPrice" type="number" placeholder="Discounted Price" value={formData.discountedPrice} onChange={handleChange} />
          <Input name="duration_months" type="number" placeholder="Duration (Months)" value={formData.duration_months} onChange={handleChange} />
          <Input name="uwaciCoinsRequired" type="number" placeholder="Uwaci Coins Required" value={formData.uwaciCoinsRequired} onChange={handleChange} />
          <Textarea name="cancellationPolicy" placeholder="Cancellation Policy" value={formData.cancellationPolicy} onChange={handleChange} />
          <Input name="minimum_term" type="number" placeholder="Minimum Term" value={formData.minimum_term} onChange={handleChange} />

          <select name="region" value={formData.region} onChange={handleChange} required className="w-full border rounded p-2">
            <option value="">Select Region</option>
            <option value="AU">Australia</option>
            <option value="NZ">New Zealand</option>
            <option value="US">United States</option>
          </select>

          {/* Active checkbox (same UX as Products) */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              checked={!!formData.is_active}
              onChange={handleChange}
            />
            Active
          </label>

          {error && <p className="text-red-600 text-center">{error}</p>}
          <div className="flex justify-center">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Service' : 'Add Service'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
