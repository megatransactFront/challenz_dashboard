'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function AddServicePage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    standardPrice: '',
    discountedPrice: '',
    duration_months: '',
    uwaciCoinsRequired: '',
    minimum_term: '',
    is_active: true,
    region: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const res = await fetch('/api/services_ID', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          standardPrice: parseFloat(formData.standardPrice) || 0,
          discountedPrice: formData.discountedPrice === '' ? null : (parseFloat(formData.discountedPrice) || 0),
          duration_months: parseInt(formData.duration_months) || 0,
          uwaciCoinsRequired: parseInt(formData.uwaciCoinsRequired) || 0,
          minimum_term: parseInt(formData.minimum_term) || 0,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError("Failed to add service: " + (data.error || "Unknown error"))
      } else {
        setSuccess("Service added successfully!")
        setTimeout(() => router.push('/services_ID'), 900)
      }
    } catch (err: any) {
      setError("Failed to add service: " + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="p-8">
          <h1 className="text-2xl font-semibold mb-1 text-center">Add a New Service</h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input name="name" value={formData.name} placeholder="Service Name" onChange={handleChange} required />
            <Textarea name="description" value={formData.description} placeholder="Description" onChange={handleChange} required />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input name="standardPrice" value={formData.standardPrice} placeholder="Standard Price (USD)" onChange={handleChange} type="number" min={0} step="0.01" required />
              <Input name="discountedPrice" value={formData.discountedPrice} placeholder="Discounted Price (optional)" onChange={handleChange} type="number" min={0} step="0.01" />
              <Input name="duration_months" value={formData.duration_months} placeholder="Duration (months)" onChange={handleChange} type="number" min={0} />
              <Input name="uwaciCoinsRequired" value={formData.uwaciCoinsRequired} placeholder="UWC Coins Required" onChange={handleChange} type="number" min={0} />
              <Input name="minimum_term" value={formData.minimum_term} placeholder="Minimum Term (months)" onChange={handleChange} type="number" min={0} />
              <select name="region" value={formData.region} onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="">Select Country</option>
                <option value="NZ">NZ</option>
                <option value="AU">AU</option>
                <option value="US">US</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} id="is_active" />
              <label htmlFor="is_active" className="text-sm">Active</label>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}

            <div className="flex justify-center">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Submit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
