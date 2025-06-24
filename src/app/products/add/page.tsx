'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from '@/lib/supabase/client'

export default function AddProductPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    price_usd: '',
    stock: '',
    image_url: '',
    // manufacturer_id: '', // optional: or set a default if applicable
    uwc_discount_enabled: false,
    is_active: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!['edible', 'non-edible'].includes(formData.type)) {
      alert("Type must be 'edible' or 'non-edible'")
      return
    }

    const { error } = await supabase.from('products').insert({
      ...formData,
      price_usd: parseFloat(formData.price_usd) || 0,
      stock: parseInt(formData.stock) || 0,
    //   manufacturer_id: formData.manufacturer_id || null,
    })

    if (error) {
      alert("Failed to add product: " + error.message)
    } else {
      alert("Product added successfully")
      router.push('/products')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" value={formData.name} placeholder="Name" onChange={handleChange} required />
        <Textarea name="description" value={formData.description} placeholder="Description" onChange={handleChange} required />
        
        <select name="type" value={formData.type} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">Select Type</option>
          <option value="edible">Edible</option>
          <option value="non-edible">Non-edible</option>
        </select>

        <Input name="price_usd" value={formData.price_usd} placeholder="Price (USD)" onChange={handleChange} type="number" required />
        <Input name="stock" value={formData.stock} placeholder="Stock" onChange={handleChange} type="number" required />
        <Input name="image_url" value={formData.image_url} placeholder="Image URL" onChange={handleChange} />

        {/* Optional Manufacturer ID (e.g. prefilled or dropdown) */}
        {/* <Input name="manufacturer_id" value={formData.manufacturer_id} placeholder="Manufacturer ID" onChange={handleChange} required /> */}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="uwc_discount_enabled"
            checked={formData.uwc_discount_enabled}
            onChange={handleChange}
          />
          <label htmlFor="uwc_discount_enabled">Enable UWC Discount</label>
        </div>

        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
          Submit
        </Button>
      </form>
    </div>
  )
}
