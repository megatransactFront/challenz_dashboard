// src/app/services_ID/list/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Service = {
  id: string
  name: string
  description: string
  region: string
  standardPrice: number
  discountedPrice?: number | null
  duration_months: number
  uwaciCoinsRequired: number
  cancellationPolicy: string
  minimum_term: number
  created_at: string
  is_active: boolean
}

export default function ServiceListPage({ region }: { region: string }) {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const money = (n: number | null | undefined) =>
    `$${(Number(n ?? 0)).toFixed(2)}`

  const discountEnabled = (s: Service) =>
    s.discountedPrice != null &&
    !Number.isNaN(Number(s.discountedPrice)) &&
    Number(s.discountedPrice) < Number(s.standardPrice)

  const fetchServices = async () => {
    setLoading(true)
    try {
      const qs = region ? `?region=${region}` : ''
      const res = await fetch(`/api/services_ID${qs}`)
      const data = await res.json()
      const list: Service[] = (data.services || []).map((s: any) => ({
        ...s,
        is_active: s.is_active ?? true,
      }))
      setServices(list)
    } catch (e) {
      console.error(e)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region])

  const updateLocal = (id: string, patch: Partial<Service>) =>
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)))

  const handleToggle = async (id: string, next: boolean) => {
    const prev = services.find(s => s.id === id)?.is_active
    updateLocal(id, { is_active: next }) // optimistic
    try {
      const res = await fetch(`/api/services_ID/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: next }),
      })
      if (!res.ok) throw new Error('toggle failed')
    } catch (e) {
      updateLocal(id, { is_active: !!prev }) // rollback
      alert('Could not update status. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    const prev = services
    updateLocal(id, { name: '(deleting...)' })
    try {
      const res = await fetch(`/api/services_ID/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('delete failed')
      setServices(prev.filter(s => s.id !== id))
    } catch (e) {
      setServices(prev) // rollback list
      alert('Could not delete. Please try again.')
    }
  }

  if (loading) return <p className="text-center text-sm text-gray-500 mt-4">Loading services...</p>
  if (!services.length) return <p className="text-center text-sm text-gray-500 mt-4">No services available.</p>

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-700">
            <th className="px-6 py-4 text-left font-semibold">SERVICE</th>
            <th className="px-6 py-4 text-left font-semibold">DESCRIPTION</th>
            <th className="px-6 py-4 text-left font-semibold">PRICE (USD)</th>
            <th className="px-6 py-4 text-left font-semibold">DURATION</th>
            <th className="px-6 py-4 text-left font-semibold">DISCOUNT</th>
            <th className="px-6 py-4 text-left font-semibold">ACTIONS</th>
            <th className="px-6 py-4 text-left font-semibold">STATUS</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {services.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              {/* SERVICE */}
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  {/* no image for services; keep alignment similar to products */}
                  <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                    SVC
                  </div>
                  <div className="font-semibold text-gray-900">{s.name}</div>
                </div>
              </td>

              {/* DESCRIPTION */}
              <td className="px-6 py-5 text-gray-600">
                <div className="max-w-md">
                  {s.description}
                  <div className="text-xs text-gray-400 mt-1">Region: {s.region}</div>
                </div>
              </td>

              {/* PRICE */}
              <td className="px-6 py-5 font-medium text-gray-900">
                {money(s.discountedPrice ?? s.standardPrice)}
              </td>

              {/* DURATION */}
              <td className="px-6 py-5 text-gray-600">
                {s.duration_months} months
              </td>

              {/* DISCOUNT */}
              <td className="px-6 py-5">
                {discountEnabled(s) ? (
                  <div className="inline-flex items-center gap-2 text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-600" />
                    Enabled
                  </div>
                ) : (
                  <span className="text-gray-400">Disabled</span>
                )}
              </td>

              {/* ACTIONS */}
              <td className="px-6 py-5">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/services_ID/edit/${s.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>

              {/* STATUS */}
              <td className="px-6 py-5">
                <div className="flex items-center justify-end gap-3">
                  <span className={s.is_active ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {s.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={s.is_active}
                      onChange={(e) => handleToggle(s.id, e.target.checked)}
                    />
                    <div className="
                      h-6 w-11 rounded-full bg-gray-300 transition
                      peer-checked:bg-emerald-500
                    "></div>
                    <div className="
                      absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition
                      peer-checked:translate-x-5
                    "></div>
                  </label>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
