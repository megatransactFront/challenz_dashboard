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

    if (!['edible', 'non-edible', 'branded'].includes(formData.type)) {
      setError("Type must be 'edible' or 'non-edible'")
      setLoading(false)
      return
    }

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

          <form onSubmit={handleSubmit} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              placeholder="Product Name"
              onChange={handleChange}
              required
              className="w-full"
            />
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
              </label>
            <Textarea
              name="description"
              value={formData.description}
              placeholder="Description"
              onChange={handleChange}
              required
              className="w-full"
            />
            <label className="block text-sm font-medium text-gray-700">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Type</option>
              <option value="edible">Edible</option>
              <option value="branded">Branded</option>
              <option value="non-edible">Non-edible</option>
            </select>
            <label className="block text-sm font-medium text-gray-700">
              Price (USD) <span className="text-red-500">*</span>
            </label>
            <Input
              name="price_usd"
              value={formData.price_usd}
              placeholder="Price (USD)"
              onChange={handleChange}
              type="number"
              min={0}
              step="0.01"   
              required
              className="w-full"
            />
            <label className="block text-sm font-medium text-gray-700">
              Stock <span className="text-red-500">*</span>
            </label>
            <Input
              name="stock"
              value={formData.stock}
              placeholder="Stock"
              onChange={handleChange}
              type="number"
              min={0}
              required
              className="w-full"
            />
            <label className="block text-sm font-medium text-gray-700">
              Country <span className="text-red-500">*</span>
            </label>
            <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            >
              <option value="">Select Country</option>
              <option value="NZ">NZ</option>
              <option value="AU">AU</option>
              <option value="US">US</option>
            </select>
            <Input
              name="image_url"
              value={formData.image_url}
              placeholder="Image URL"
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="uwc_discount_enabled"
                checked={formData.uwc_discount_enabled}
                onChange={handleChange}
                id="uwc_discount_enabled"
              />
              <label htmlFor="uwc_discount_enabled" className="text-sm">
                Enable UWC Discount
              </label>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-600 text-sm text-center">{success}</div>
            )}
            
            <div className="flex justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/products')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                >
                  {loading ? 'Saving...' : 'Submit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
