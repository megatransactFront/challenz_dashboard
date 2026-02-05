"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/app/types/products";
import { FlashSale, FlashSaleProduct } from "@/app/types/flashsale";
import { Service } from "@/app/types/services";
import { FlashSaleService } from "@/app/types/flashsale";
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
  const router = useRouter();

  const [tab, setTab] = useState<"products" | "services">("products");

  // product state
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProductLabel, setSelectedProductLabel] =
    useState("Select a product");

  // service state
  const [services, setServices] = useState<FlashSaleService[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [selectedServiceLabel, setSelectedServiceLabel] =
    useState("Select a service");

  const [loading, setLoading] = useState(true);
  const [flashSale, setFlashSale] = useState<FlashSale | null>(null);

  const [formData, setFormData] = useState({
    product_id: "",
    bonus_promo_discount: "",
    region: "",
  });

  const [serviceFormData, setServiceFormData] = useState({
    service_id: "",
    bonus_promo_discount: "",
    region: "",
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // product editing state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<FlashSaleProduct | null>(null);
  const [editDiscount, setEditDiscount] = useState("");

  // service editing state
  const [editServiceModalOpen, setEditServiceModalOpen] = useState(false);
  const [editingService, setEditingService] =
    useState<FlashSaleService | null>(null);
  const [editServiceDiscount, setEditServiceDiscount] = useState("");

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

  const fetchFlashSaleServices = async () => {
    const res = await fetch(`/api/sales/${id}/services?limit=100000`);
    const json = await res.json();
    setServices(json.data);
  };

  const fetchAllServices = async () => {
    const res = await fetch("/api/services?limit=100000");
    const json = await res.json();
    setAllServices(json.services);
  };

  useEffect(() => {
    fetchFlashSaleProducts();
    fetchAllProducts();
    fetchFlashSaleServices();
    fetchAllServices();
    fetchFlashSaleDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch functions are stable; re-run when id changes only
  }, [id]);

  const fixDiscount = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  // ------------------- Add Handlers -------------------

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
        setSelectedProductLabel("Select a product");
        fetchFlashSaleProducts();
        setSuccess("Product added to flash sale!");
      } else {
        setError("Failed to add product.");
      }
    } catch (err: any) {
      setError("Failed to add product: " + err.message);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/sales/${id}/services`, {
        method: "POST",
        body: JSON.stringify({
          ...serviceFormData,
          flashsalesid: id,
          bonus_promo_discount: Number(serviceFormData.bonus_promo_discount),
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setServiceFormData({
          service_id: "",
          bonus_promo_discount: "",
          region: "",
        });
        setSelectedServiceLabel("Select a service");
        fetchFlashSaleServices();
        setSuccess("Service added to flash sale!");
      } else {
        setError("Failed to add service.");
      }
    } catch (err: any) {
      setError("Failed to add service: " + err.message);
    }
  };

  // ------------------- Product Edit/Delete -------------------

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
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete product");
      fetchFlashSaleProducts();
      setSuccess("Deleted product!");
      setEditModalOpen(false);
    } catch (err) {
      setError("Delete failed.");
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
    } catch {
      setError("Failed to update product.");
    }
  };

  // ------------------- Service Edit/Delete -------------------

  const handleEditService = (service: FlashSaleService) => {
    setEditingService(service);
    setEditServiceDiscount(service.bonus_promo_discount.toString());
    setEditServiceModalOpen(true);
  };

  const deleteService = async () => {
    if (!editingService) return;
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(
        `/api/sales/${id}/services/${editingService.flashsaleserviceid}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete service");
      setEditServiceModalOpen(false);
      fetchFlashSaleServices();
      setSuccess("Service deleted!");
    } catch {
      setError("Failed to delete service.");
    }
  };

  const saveServiceEdit = async () => {
    if (!editingService) return;
    try {
      const res = await fetch(
        `/api/sales/${id}/services/${editingService.flashsaleserviceid}`,
        {
          method: "PUT",
          body: JSON.stringify({
            bonus_promo_discount: Number(editServiceDiscount),
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to update service");
      setEditServiceModalOpen(false);
      setEditingService(null);
      fetchFlashSaleServices();
      setSuccess("Service updated!");
    } catch {
      setError("Failed to update service.");
    }
  };

  // ------------------- Render -------------------

  return (
    <div className="max-w-2xl mx-auto p-10">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/sales")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Flash Sale Info */}
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

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <Button
          variant={tab === "products" ? "default" : "outline"}
          onClick={() => setTab("products")}
        >
          Products
        </Button>
        <Button
          variant={tab === "services" ? "default" : "outline"}
          onClick={() => setTab("services")}
        >
          Services
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardContent>
          {tab === "products" ? (
            <form onSubmit={handleAddProduct} className="space-y-2">
              <h2 className="text-lg font-semibold">Add Product to Flash Sale</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedProductLabel}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    allProducts.map((product) => (
                      <DropdownMenuItem
                        key={product.id}
                        onSelect={() => {
                          setFormData({
                            ...formData,
                            product_id: product.id,
                            region: product.region,
                          });
                          setSelectedProductLabel(
                            `${product.name} (${product.region})`
                          );
                        }}
                      >
                        {product.name} ({product.region})
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                type="number"
                placeholder="Discount %"
                value={formData.bonus_promo_discount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bonus_promo_discount: e.target.value,
                  })
                }
                required
              />
              <Button type="submit">Add Product</Button>
            </form>
          ) : (
            <form onSubmit={handleAddService} className="space-y-2">
              <h2 className="text-lg font-semibold">Add Service to Flash Sale</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedServiceLabel}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : allServices && allServices.length > 0 ? (
                    allServices.map((service) => (
                      <DropdownMenuItem
                        key={service.id}
                        onSelect={() => {
                          setServiceFormData({
                            ...serviceFormData,
                            service_id: service.id,
                            region: service.region,
                          });
                          setSelectedServiceLabel(`${service.name} (${service.region})`);
                        }}
                      >
                        {service.name} ({service.region})
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <p>No services found</p>
                  )}

                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                type="number"
                placeholder="Discount %"
                value={serviceFormData.bonus_promo_discount}
                onChange={(e) =>
                  setServiceFormData({
                    ...serviceFormData,
                    bonus_promo_discount: e.target.value,
                  })
                }
                required
              />
              <Button type="submit">Add Service</Button>
            </form>
          )}
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

      {/* Linked */}
      <h2 className="text-lg font-semibold mt-6">
        {tab === "products" ? "Linked Products" : "Linked Services"}
      </h2>

      {loading ? (
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      ) : tab === "products" ? (
        products.length === 0 ? (
          <p>No products yet.</p>
        ) : (
          <ul className="space-y-2">
            {products.map((item) => (
              <Card key={item.flashsaleproductsid}>
                <li
                  className="border p-4 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => handleEdit(item)}
                >
                  <div className="flex justify-between items-center gap-4">
                    {item.products?.image_url ? (
                      <Image
                        src={item.products.image_url}
                        alt={item.products?.name || "Product image"}
                        width={80}
                        height={80}
                        className="h-20 w-20 object-cover rounded"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded bg-gray-100 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p>
                        <strong>{item.products?.name}</strong>
                      </p>
                      <p>Region: {item.region}</p>
                      <p>Discount: {item.bonus_promo_discount}%</p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
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
        )
      ) : services.length === 0 ? (
        <p>No services yet.</p>
      ) : (
        <ul className="space-y-2">
          {services.map((item) => (
            <Card key={item.flashsaleserviceid}>
              <li
                className="border p-4 rounded cursor-pointer hover:bg-gray-200"
                onClick={() => handleEditService(item)}
              >
                <div className="flex justify-between items-center gap-4">
                  {item.services?.image_url ? (
                    <Image
                      src={item.services.image_url}
                      alt={item.services?.name || "Service image"}
                      width={80}
                      height={80}
                      className="h-20 w-20 object-cover rounded"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded bg-gray-100 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p>
                      <strong>{item.services?.name}</strong>
                    </p>
                    <p>Region: {item.region}</p>
                    <p>Discount: {item.bonus_promo_discount}%</p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditService(item);
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

      {/* Product Edit Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Flash Sale Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Additional discount (%)<span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder="Extra Discount %"
              value={editDiscount}
              onChange={(e) => {
                const raw = e.target.value;
                const value = fixDiscount(Number(raw), 0, 100);
                setEditDiscount(raw === "" ? "" : String(value));
              }}
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

      {/* Service Edit Dialog */}
      <Dialog open={editServiceModalOpen} onOpenChange={setEditServiceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Flash Sale Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Additional discount (%)<span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder="Extra Discount %"
              value={editServiceDiscount}
              onChange={(e) => {
                const raw = e.target.value;
                const value = fixDiscount(Number(raw), 0, 100);
                setEditServiceDiscount(raw === "" ? "" : String(value));
              }}
              min={0}
              max={100}
              required
            />
            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="ghost"
                onClick={() => setEditServiceModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={deleteService}>
                Delete
              </Button>
              <Button onClick={saveServiceEdit}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
