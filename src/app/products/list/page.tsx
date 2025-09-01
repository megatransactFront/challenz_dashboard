'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, BadgePercent } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SimpleSwitch } from "@/components/ui/simple-switch"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from "@/lib/supabase/client"

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
  region: string
  _updating?: boolean
}

type PaginationData = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export default function Page({ region }: { region: string }) {
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
  
  // Manufacturer selection states
  const [isManufacturerListOpen, setIsManufacturerListOpen] = useState<boolean>(false)
  const [allManufacturers, setAllManufacturers] = useState<any[]>([])
  const [selectedManufacturers, setSelectedManufacturers] = useState<Set<string>>(new Set())
  const [currentProductId, setCurrentProductId] = useState<string>("")
  const [manufacturerLoading, setManufacturerLoading] = useState(false)
  
  // Product manufacturers view states
  const [isViewManufacturersOpen, setIsViewManufacturersOpen] = useState<boolean>(false)
  const [productManufacturers, setProductManufacturers] = useState<any[]>([])
  const [productManufacturerCounts, setProductManufacturerCounts] = useState<{[key: string]: number}>({})
  const [viewManufacturersLoading, setViewManufacturersLoading] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page.toString(), limit: '10' })
      if (region) params.append('region', region) 
      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data.products || [])
      setPagination(data.pagination)
      
      // Fetch manufacturer counts for all products
      await fetchManufacturerCounts(data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page, region])

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

// Fetch all manufacturers for selection
const fetchAllManufacturers = async () => {
  try {
    setManufacturerLoading(true)
    const { data, error } = await supabase.rpc('get_all_manufacturers')
    if (error) throw error
    setAllManufacturers(data || [])
  } catch (error: any) {
    console.error('Error fetching manufacturers:', error)
    alert('Error fetching manufacturers: ' + error.message)
  } finally {
    setManufacturerLoading(false)
  }
}

// Fetch manufacturer counts for products
const fetchManufacturerCounts = async (products: Product[]) => {
  try {
    const counts: {[key: string]: number} = {}
    
    // Fetch count for each product
    for (const product of products) {
      const { data, error } = await supabase
        .rpc('get_product_manufacturers', { p_product_id: product.id })
      
      if (error) {
        console.error('Error fetching manufacturer count for product', product.id, error)
        counts[product.id] = 0
      } else {
        counts[product.id] = data?.length || 0    
      }
    }
    
    setProductManufacturerCounts(counts)
  } catch (error: any) {
    console.error('Error fetching manufacturer counts:', error)
  }
}

// Fetch manufacturers for a specific product
const fetchProductManufacturers = async (productId: string) => {
  try {
    setViewManufacturersLoading(true)
    const { data, error } = await supabase
      .rpc('get_product_manufacturers', { p_product_id: productId })
    
    if (error) throw error
    setProductManufacturers(data || [])
  } catch (error: any) {
    console.error('Error fetching product manufacturers:', error)
    alert('Error fetching product manufacturers: ' + error.message)
  } finally {
    setViewManufacturersLoading(false)
  }
}

// Open view manufacturers modal
const openViewManufacturers = (productId: string) => {
  setCurrentProductId(productId)
  fetchProductManufacturers(productId)
  setIsViewManufacturersOpen(true)
}

// Handle manufacturer selection
const handleManufacturerSelect = (manufacturerId: string) => {
  const newSelected = new Set(selectedManufacturers)
  if (newSelected.has(manufacturerId)) {
    newSelected.delete(manufacturerId)
  } else {
    newSelected.add(manufacturerId)
  }
  setSelectedManufacturers(newSelected)
}

// Open manufacturer selection modal
const openManufacturerList = (productId: string) => {
  setCurrentProductId(productId)
  setSelectedManufacturers(new Set())
  fetchAllManufacturers()
  setIsManufacturerListOpen(true)
}

// Save selected manufacturers to product
const saveSelectedManufacturers = async () => {
  console.log('Function called - saveSelectedManufacturers')
  console.log('Current Product ID:', currentProductId)
  console.log('Selected Manufacturers:', Array.from(selectedManufacturers))
  
  if (!currentProductId || selectedManufacturers.size === 0) {
    console.log('Early return - missing product ID or no manufacturers selected')
    alert('Please select at least one manufacturer')
    return
  }
  
  try {
    console.log('Sending data to API:', {
      product_id: currentProductId,
      manufacturer_ids: Array.from(selectedManufacturers)
    })

    const response = await fetch('https://masswgndvgtpdabpknsx.supabase.co/functions/v1/add-product-manufacturers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        product_id: currentProductId,
        manufacturer_ids: Array.from(selectedManufacturers)
      })
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    const result = await response.json()
    console.log('API Response:', result)

    if (!response.ok) {
      throw new Error(result.error || result.details || `HTTP ${response.status}: Failed to save manufacturers`)
    }

    // Check if the API returned partial success (status 207)
    if (result.errors && result.errors.length > 0) {
      console.warn('Some manufacturers failed to save:', result.errors)
      alert(`Warning: ${result.total_inserted} manufacturers saved successfully, but ${result.total_failed} failed. Check console for details.`)
    } else {
      alert(`${result.total_inserted} manufacturers successfully added to product`)
    }
    
    setIsManufacturerListOpen(false)
    setSelectedManufacturers(new Set())
    setCurrentProductId("")
    
    // Refresh the products list and manufacturer counts
    await fetchProducts()
  } catch (error: any) {
    console.error('Error saving manufacturers:', error)
    alert('Error saving manufacturers: ' + error.message)
  }
}



  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="p-2">
      <Card>
        <CardContent className="p-2">
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
                      <th className="text-left py-4 px-4 font-semibold">MANUFACTURERS</th>
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openViewManufacturers(product.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                            >
                              {productManufacturerCounts[product.id] || 0} Manufacturers
                            </button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openManufacturerList(product.id)}
                              className="text-xs px-2 py-1 h-6"
                            >
                              Add Manufacturers
                            </Button>
                          </div>
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


              <div className="space-y-1 mt-2">
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
                    {
                    formData.region === 'NZ' ? 'New Zealand'
                    : formData.region === 'AU' ? 'Australia'
                    : formData.region === 'US' ? 'United States'
                    : '-'
                    }
                  </p>
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

      {/* Manufacturer Selection Modal */}
      <Dialog open={isManufacturerListOpen} onOpenChange={setIsManufacturerListOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Manufacturers for Product</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {manufacturerLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading manufacturers...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {allManufacturers.length > 0 ? (
                  allManufacturers.map((manufacturer) => (
                    <div 
                      key={manufacturer.manufacturer_id} 
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleManufacturerSelect(manufacturer.manufacturer_id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedManufacturers.has(manufacturer.manufacturer_id)}
                        onChange={() => handleManufacturerSelect(manufacturer.manufacturer_id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-900">{manufacturer.name}</h3>
                          <span className="text-sm text-gray-500">{manufacturer.country || 'N/A'}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {[manufacturer.city, manufacturer.state].filter(Boolean).join(', ') || 'Location not specified'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {manufacturer.contact_email || manufacturer.phone_number || 'No contact info'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    No manufacturers found
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              {selectedManufacturers.size} manufacturer(s) selected
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsManufacturerListOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={saveSelectedManufacturers}
                disabled={selectedManufacturers.size === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Selection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Product Manufacturers Modal */}
      <Dialog open={isViewManufacturersOpen} onOpenChange={setIsViewManufacturersOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Product Manufacturers</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {viewManufacturersLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading manufacturers...</span>
              </div>
            ) : (
              <div>
                {productManufacturers.length === 0 ? (
                  <div className="text-center p-8 text-gray-500">
                    No manufacturers found for this product
                  </div>
                ) : (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {productManufacturers.map((manufacturer) => (
                      <div 
                        key={manufacturer.manufacturer_id} 
                        className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                          {manufacturer.name}
                        </h3>
                        
                        {manufacturer.contact_email && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-600">Email: </span>
                            <span className="text-sm text-gray-800">{manufacturer.contact_email}</span>
                          </div>
                        )}
                        
                        {manufacturer.phone_number && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-600">Phone: </span>
                            <span className="text-sm text-gray-800">{manufacturer.phone_number}</span>
                          </div>
                        )}
                        
                        {manufacturer.country && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-600">Country: </span>
                            <span className="text-sm text-gray-800">{manufacturer.country}</span>
                          </div>
                        )}
                        
                        {(manufacturer.city || manufacturer.state) && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-600">Location: </span>
                            <span className="text-sm text-gray-800">
                              {[manufacturer.city, manufacturer.state].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                        
                        {manufacturer.street && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-600">Address: </span>
                            <span className="text-sm text-gray-800">{manufacturer.street}</span>
                          </div>
                        )}
                        
                        {manufacturer.postcode && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-600">Postcode: </span>
                            <span className="text-sm text-gray-800">{manufacturer.postcode}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsViewManufacturersOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
