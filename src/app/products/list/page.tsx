'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, BadgePercent } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SimpleSwitch } from "@/components/ui/simple-switch"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Product = {
  id: string
  name: string
  description: string
  type: string
  price_usd: number
  stock: number | null
  uwc_discount_enabled: boolean | null
  image_url: string | null
  is_active: boolean | null
  manufacturer_id: string
  created_at: string
}

type PaginationData = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productDetailsLoading, setProductDetailsLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })

  const [formData, setFormData] = useState<Partial<Product>>({})
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page.toString(), limit: '10' })
      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data.products || [])
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page])

  const fetchProductDetails = async (productId: string) => {
    try {
      setProductDetailsLoading(true)
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) throw new Error('Failed to fetch product details')
      const data = await response.json()
      setSelectedProduct(data)
      setFormData(data)
      setEditMode(false)
    } catch (err) {
      console.error('Error fetching product details:', err)
    } finally {
      setProductDetailsLoading(false)
    }
  }

const handleSave = async () => {
  if (!selectedProduct) return
  if (!['edible', 'non-edible'].includes(formData.type || '')) {
    alert("Type must be either 'edible' or 'non-edible'")
    return
  }
  setSaving(true)
  try {
    const response = await fetch(`/api/products/${selectedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    if (!response.ok) throw new Error('Failed to update product')
    await fetchProducts()
    setSelectedProduct(null)
    setEditMode(false)
  } catch (err) {
    console.error(err)
    alert('Update failed.')
  } finally {
    setSaving(false)
  }
}

const handleDelete = async () => {
  if (!selectedProduct) return;
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const response = await fetch(`/api/products/${selectedProduct.id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error('Failed to delete product');
    await fetchProducts();
    setSelectedProduct(null);
  } catch (err) {
    alert("Delete failed.");
    console.error(err);
  }
};



  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-center">Product List</h2>

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
                      <th className="text-left py-4 px-4 font-semibold">PRODUCT</th>
                      <th className="text-left py-4 px-4 font-semibold">DESCRIPTION</th>
                      <th className="text-left py-4 px-4 font-semibold">PRICE (USD)</th>
                      <th className="text-left py-4 px-4 font-semibold">STOCK</th>
                      <th className="text-left py-4 px-4 font-semibold">DISCOUNT</th>
                      <th className="text-left py-4 px-4 font-semibold">ACTIONS</th>
                      <th className="text-left py-4 px-4 font-semibold">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-600">
                                N/A
                              </div>
                            )}
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">{product.description}</td>
                        <td className="py-4 px-4">${product.price_usd.toFixed(2)}</td>
                        <td className="py-4 px-4">{product.stock ?? 'N/A'}</td>
                        <td className="py-4 px-4">
                          {product.uwc_discount_enabled ? (
                            <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                              <BadgePercent className="w-4 h-4" /> Enabled
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm"> Disabled</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            variant="outline"
                            onClick={() => fetchProductDetails(product.id)}
                          >
                            Edit / Delete
                          </Button>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className={product.is_active ? "text-green-600 font-medium" : "text-gray-400 font-medium"}>
                              {product.is_active ? "Active" : "Inactive"}
                            </span>
                          <SimpleSwitch
                          checked={!!product.is_active}
                          onChange={async (checked) => {
                            setProducts(curr => curr.map(p =>
                              p.id === product.id ? { ...p, _updating: true } : p
                            ));
                            await fetch(`/api/products/${product.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ is_active: checked }),
                            });
                            await fetchProducts();
                          }}
                          />
                         {product._updating && (
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
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-2xl">
          {productDetailsLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : selectedProduct ? (
            <>
            <DialogHeader>
              <DialogTitle className="text-center">
                {editMode ? 'Edit Product' : 'Product Details'}
              </DialogTitle>
            </DialogHeader>


              <div className="space-y-4 mt-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  {editMode ? (
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">{formData.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  {editMode ? (
                    <Input
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">{formData.description}</p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  {editMode ? (
                    <select
                      value={formData.type || ''}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Select Type</option>
                      <option value="edible">Edible</option>
                      <option value="non-edible">Non-edible</option>
                    </select>
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">{formData.type}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
                  {editMode ? (
                    <Input
                      type="number"
                      value={formData.price_usd || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, price_usd: parseFloat(e.target.value) || 0 })
                      }
                    />
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">${formData.price_usd?.toFixed(2)}</p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  {editMode ? (
                    <Input
                      type="number"
                      value={formData.stock ?? ''}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: parseInt(e.target.value) || null })
                      }
                    />
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">{formData.stock ?? 'N/A'}</p>
                  )}
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discount</label>
                  {editMode ? (
                    <select
                      value={formData.uwc_discount_enabled ? 'true' : 'false'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          uwc_discount_enabled: e.target.value === 'true'
                        })
                      }
                      className="border p-2 rounded w-full"
                    >
                      <option value="false">Disabled</option>
                      <option value="true">Enabled</option>
                    </select>
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">
                      {formData.uwc_discount_enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  )}
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
                  <Button variant="outline" onClick={() => {
                    setEditMode(false);
                    setFormData(selectedProduct); 
                    }}>
                      Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  </>
                  ) : (
                  <Button onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                )}
                 <Button variant="destructive" onClick={handleDelete}>
                    Delete
                 </Button>
                 <Button variant="ghost" onClick={() => setSelectedProduct(null)}>
                    Close
                 </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
