'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, BadgePercent } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SimpleSwitch } from "@/components/ui/simple-switch"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Service = {
  id: string
  name: string
  description: string
  region: string
  standardPrice: number
  discountedPrice: number | null
  duration_months: number
  uwaciCoinsRequired: number
  minimum_term: number
  is_active: boolean | null
  created_at: string
}

type PaginationData = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export default function Page({ region }: { region: string }) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const [selected, setSelected] = useState<Service | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Service>>({})
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page.toString(), limit: '10' })
      if (region) params.append('region', region)
      const res = await fetch(`/api/services_ID?${params}`)
      if (!res.ok) throw new Error('Failed to fetch services')
      const data = await res.json()
      setServices((data.services || []).map((s: any) => ({
        ...s,
        is_active: s.is_active ?? true,
      })))
      setPagination(data.pagination ?? { currentPage: 1, totalPages: 1, totalItems: (data.services || []).length, itemsPerPage: 10 })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page, region])

  const fetchServiceDetails = async (id: string) => {
    try {
      setDetailsLoading(true)
      const res = await fetch(`/api/services_ID/${id}`)
      if (!res.ok) throw new Error('Failed to fetch service details')
      const data = await res.json()
      // expect { service: {...} } or raw object
      const service = data.service ?? data
      setSelected(service)
      setFormData(service)
      setEditMode(false)
    } catch (e) {
      console.error(e)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const body = {
        ...formData,
        standardPrice: Number(formData.standardPrice ?? 0),
        discountedPrice:
          formData.discountedPrice === null || formData.discountedPrice === undefined || formData.discountedPrice === ('' as any)
            ? null
            : Number(formData.discountedPrice),
        duration_months: Number(formData.duration_months ?? 0),
        uwaciCoinsRequired: Number(formData.uwaciCoinsRequired ?? 0),
        minimum_term: Number(formData.minimum_term ?? 0),
      }
      const res = await fetch(`/api/services_ID/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to update service')
      await fetchServices()
      setSelected(null)
      setEditMode(false)
    } catch (e) {
      console.error(e)
      alert('Update failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    if (!confirm("Are you sure you want to delete this service?")) return
    try {
      const res = await fetch(`/api/services_ID/${selected.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete service')
      await fetchServices()
      setSelected(null)
    } catch (e) {
      console.error(e)
      alert('Delete failed.')
    }
  }

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const money = (n: number | null | undefined) => `$${Number(n ?? 0).toFixed(2)}`
  const discountEnabled = (s: Service) =>
    s.discountedPrice != null && Number(s.discountedPrice) < Number(s.standardPrice)

  return (
    <div className="p-2">
      <Card>
        <CardContent className="p-2">
          <h2 className="text-xl font-semibold mb-6 text-center">Service List</h2>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-semibold">SERVICE</th>
                      <th className="text-left py-4 px-4 font-semibold">DESCRIPTION</th>
                      <th className="text-left py-4 px-4 font-semibold">PRICE (USD)</th>
                      <th className="text-left py-4 px-4 font-semibold">DURATION</th>
                      <th className="text-left py-4 px-4 font-semibold">DISCOUNT</th>
                      <th className="text-left py-4 px-4 font-semibold">ACTIONS</th>
                      <th className="text-left py-4 px-4 font-semibold">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((svc) => (
                      <tr key={svc.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-600">
                              SVC
                            </div>
                            <span className="font-medium">{svc.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          <div className="max-w-md">{svc.description}</div>
                          <div className="text-xs text-gray-400 mt-1">Region: {svc.region}</div>
                        </td>
                        <td className="py-4 px-4">{money(svc.discountedPrice ?? svc.standardPrice)}</td>
                        <td className="py-4 px-4">{svc.duration_months} months</td>
                        <td className="py-4 px-4">
                          {discountEnabled(svc) ? (
                            <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                              <BadgePercent className="w-4 h-4" /> Enabled
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">Disabled</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Button variant="outline" onClick={() => fetchServiceDetails(svc.id)}>
                            Edit / Delete
                          </Button>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className={svc.is_active ? "text-green-600 font-medium" : "text-gray-400 font-medium"}>
                              {svc.is_active ? "Active" : "Inactive"}
                            </span>
                            <SimpleSwitch
                              checked={!!svc.is_active}
                              onChange={async (checked) => {
                                setServices(curr => curr.map(p =>
                                  p.id === svc.id ? { ...p, _updating: true as any } : p
                                ))
                                await fetch(`/api/services_ID/${svc.id}/status`, {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ is_active: checked }),
                                })
                                await fetchServices()
                              }}
                            />
                            {(svc as any)._updating && (
                              <div className="absolute inset-0 bg-black/30 z-10 rounded-lg animate-pulse" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit / View Modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-2xl">
          {detailsLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">
                  {editMode ? 'Edit Service' : 'Service Details'}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-2 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  {editMode ? (
                    <Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  ) : <p className="p-2 bg-gray-100 rounded">{formData.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  {editMode ? (
                    <Input value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  ) : <p className="p-2 bg-gray-100 rounded">{formData.description}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Standard Price (USD)</label>
                    {editMode ? (
                      <Input type="number" value={String(formData.standardPrice ?? '')}
                        onChange={(e) => setFormData({ ...formData, standardPrice: parseFloat(e.target.value) || 0 })} />
                    ) : <p className="p-2 bg-gray-100 rounded">${Number(formData.standardPrice ?? 0).toFixed(2)}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discounted Price</label>
                    {editMode ? (
                      <Input type="number" value={formData.discountedPrice as any ?? ''}
                        onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value === '' ? null : (parseFloat(e.target.value) || 0) })} />
                    ) : <p className="p-2 bg-gray-100 rounded">{formData.discountedPrice == null ? '-' : `$${Number(formData.discountedPrice).toFixed(2)}`}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration (months)</label>
                    {editMode ? (
                      <Input type="number" value={String(formData.duration_months ?? '')}
                        onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) || 0 })} />
                    ) : <p className="p-2 bg-gray-100 rounded">{formData.duration_months}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">UWC Coins</label>
                    {editMode ? (
                      <Input type="number" value={String(formData.uwaciCoinsRequired ?? '')}
                        onChange={(e) => setFormData({ ...formData, uwaciCoinsRequired: parseInt(e.target.value) || 0 })} />
                    ) : <p className="p-2 bg-gray-100 rounded">{formData.uwaciCoinsRequired}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Minimum Term</label>
                    {editMode ? (
                      <Input type="number" value={String(formData.minimum_term ?? '')}
                        onChange={(e) => setFormData({ ...formData, minimum_term: parseInt(e.target.value) || 0 })} />
                    ) : <p className="p-2 bg-gray-100 rounded">{formData.minimum_term}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    {editMode ? (
                      <select
                        value={formData.region || ''}
                        onChange={e => setFormData({ ...formData, region: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="NZ">New Zealand</option>
                        <option value="AU">Australia</option>
                        <option value="US">United States</option>
                      </select>
                    ) : (
                      <p className="p-2 bg-gray-100 rounded">
                        {formData.region === 'NZ' ? 'New Zealand'
                          : formData.region === 'AU' ? 'Australia'
                          : formData.region === 'US' ? 'United States' : '-'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="flex items-center gap-4">
                    <span className={formData.is_active ? "text-green-600 font-medium" : "text-gray-400 font-medium"}>
                      {formData.is_active ? "Active" : "Inactive"}
                    </span>
                    {editMode ? (
                      <SimpleSwitch
                        checked={!!formData.is_active}
                        onChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                {editMode ? (
                  <>
                    <Button variant="outline" onClick={() => { setEditMode(false); setFormData(selected) }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEditMode(true)}>Edit</Button>
                )}
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
