"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/app/types/products";
import { FlashSale, FlashSaleProduct } from "@/app/types/flashsale";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Notification from "@/components/ui/notification";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FlashSaleDetailPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProductLabel, setSelectedProductLabel] =
    useState<string>("Select a product");
  const [selectedRegion, setSelectedRegion] =
    useState<string>("Select a region");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flashSale, setFlashSale] = useState<FlashSale | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    product_id: "",
    bonus_promo_discount: "",
    region: "",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FlashSaleProduct | null>(
    null
  );
  const [editDiscount, setEditDiscount] = useState("");

  const fetchFlashSaleDetails = async () => {
    const res = await fetch(`/api/sales/${id}`);
    const json = await res.json();
    setFlashSale(json.data);
  };

  const fetchFlashSaleProducts = async () => {
    const res = await fetch(`/api/sales/${id}/products?limit=100000`);
    const json = await res.json();
    setProducts(json.data);
    setLoading(false);
  };

  const fetchAllProducts = async () => {
    const res = await fetch("/api/products?limit=100000");
    const json = await res.json();
    setAllProducts(json.products);
  };

  useEffect(() => {
    fetchFlashSaleProducts();
    fetchAllProducts();
    fetchFlashSaleDetails();
  }, [id]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/sales/${id}/products`, {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          flashsalesid: id,
          bonus_promo_discount: Number(formData.bonus_promo_discount),
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setFormData({ product_id: "", bonus_promo_discount: "", region: "" });
        setSelectedRegion("Select a region");
        setSelectedProductLabel("Select a product");
        fetchFlashSaleProducts();
        setSuccess("Product added to flash sale!");
      } else {
        setError("Failed to add flash sale event.");
      }
    } catch (err: any) {
      setError("Failed to add product to flash sale: " + err.message);
    }
  };

  const handleEdit = (product: FlashSaleProduct) => {
    setEditingProduct(product);
    setEditDiscount(product.bonus_promo_discount.toString());
    setEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!editingProduct) return;
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(
        `/api/sales/${id}/products/${editingProduct.flashsaleproductsid}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete product");
      fetchFlashSaleProducts();
      setEditModalOpen(false);
    } catch (err) {
      alert("Delete failed.");
      console.error(err);
    }
  };

  const saveEdit = async () => {
    if (!editingProduct) return;
    try {
      const res = await fetch(
        `/api/sales/${id}/products/${editingProduct.flashsaleproductsid}`,
        {
          method: "PUT",
          body: JSON.stringify({
            bonus_promo_discount: Number(editDiscount),
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      setEditModalOpen(false);
      setEditingProduct(null);
      fetchFlashSaleProducts();
      setSuccess("Product updated!");
    } catch (err) {
      setError("Failed to update product.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push("/sales")}
        className="mb-6"
      >
        <ArrowLeft className="h-8 w-8" />
      </Button>
      {flashSale && (
        <div className="border p-4 rounded bg-gray-50 mb-6">
          <h2 className="text-3xl font-bold">{flashSale.name}</h2>
          <p className="text-gray-700">{flashSale.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            {new Date(flashSale.start_time).toLocaleString()} →{" "}
            {new Date(flashSale.end_time).toLocaleString()}
          </p>
        </div>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleAddProduct} className="space-y-2">
            <h2 className="text-lg font-semibold">Add Product to Flash Sale</h2>
            <label className="block text-sm font-medium text-gray-700">
              Product <span className="text-red-500">*</span>
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedProductLabel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading products...</span>
                  </div>
                ) : (
                  allProducts.map((product) => (
                    <DropdownMenuItem
                      key={product.id}
                      onSelect={() => {
                        setFormData({ ...formData, product_id: product.id, region: product.region });
                        setSelectedProductLabel(`${product.name} (${product.region})`);
                        setSelectedRegion(product.region);
                      }}
                    >
                      {`${product.name} (${product.region})`}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <label className="block text-sm font-medium text-gray-700">
              Discount <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.bonus_promo_discount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bonus_promo_discount: e.target.value,
                })
              }
              placeholder="Discount %"
              min={0}
              max={100}
              required
            />
            <label className="block text-sm font-medium text-gray-700">
              Region <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Region"
              value={selectedRegion}
              key={selectedRegion}
              disabled
            />
            <Button type="submit">Add Product</Button>
          </form>
        </CardContent>
      </Card>
      {error && (
        <Notification
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Notification
          message={success}
          type="success"
          onClose={() => setSuccess(null)}
        />
      )}


      <h2 className="text-lg font-semibold mt-6">Linked Products</h2>
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <ul className="space-y-2">
          {products.map((item) => (
            <Card>
              <li
                key={item.flashsaleproductsid}
                className="border p-4 rounded cursor-pointer hover:bg-gray-200"
                onClick={() => handleEdit(item)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p>
                      <strong>{item.products?.name}</strong>
                    </p>
                    <p>Region: {item.region}</p>
                    <p>Discount: {item.bonus_promo_discount}%</p>
                  </div>
                  <Button
                    onClick={() => {
                      handleEdit(item);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </li>
            </Card>
          ))}
        </ul>
      )}

      {/* Edit Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Flash Sale Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Discount %"
              value={editDiscount}
              onChange={(e) => setEditDiscount(e.target.value)}
              min={0}
              max={100}
              required
            />
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
              <Button onClick={saveEdit}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
