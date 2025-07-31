"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/app/types/products";
import { FlashSale, FlashSaleProduct } from "@/app/types/flashsale";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";


const regionOptions = [
  { value: "All", label: "All Countries" },
  { value: "NZ", label: "New Zealand" },
  { value: "AU", label: "Australia" },
  { value: "US", label: "United States" },
];

export default function FlashSaleDetailPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProductLabel, setSelectedProductLabel] = useState<string>("Select a product");
  const [selectedRegion, setSelectedRegion] = useState<string>("Select a region");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flashSale, setFlashSale] = useState<FlashSale | null>(null);


  const [formData, setFormData] = useState({
    product_id: "",
    bonus_promo_discount: "",
    region: "",
  });

  const fetchFlashSaleDetails = async () => {
    const res = await fetch(`/api/sales/${id}`);
    const json = await res.json();
    console.log("Im here: ", json)
    setFlashSale(json.data);
  };

  // Fetch all products for current flash sale
  const fetchFlashSaleProducts = async () => {
    const res = await fetch(`/api/sales/${id}/products?limit=100000`);
    const json = await res.json();
    setProducts(json.data);
    setLoading(false);
  };

  //Fetch all products for the drop-down menu
  const fetchAllProducts = async () => {
    const res = await fetch("/api/products");
    const json = await res.json();
    setAllProducts(json.products);
  };

  // Fetch it when the id changes
  useEffect(() => {
    fetchFlashSaleProducts();
    fetchAllProducts();
    fetchFlashSaleDetails()
  }, [id]);

  // Add a product
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
      }
      else {
        setError("Failed to add flash sale event.");
      }
    }
    catch (err: any) {
      setError("Failed to add product to flash sale: " + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {flashSale && (
        <div className="border p-4 rounded bg-gray-50 mb-6">
          <h1 className="text-3xl font-bold">Flash Sale Details:</h1>
          <h2 className="text-2xl">{flashSale.name}</h2>
          <p className="text-gray-700">{flashSale.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            {new Date(flashSale.start_time).toLocaleString()} →{" "}
            {new Date(flashSale.end_time).toLocaleString()}
          </p>
        </div>
      )}
      <Card>
        <CardContent>
          <div>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <h2 className="text-lg font-semibold">
                Add Product to Flash Sale
              </h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedProductLabel}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                  {allProducts.map((product) => (
                    <DropdownMenuItem
                      key={product.id}
                      onSelect={() => {
                        setFormData({
                          ...formData,
                          product_id: product.id,
                        });
                        setSelectedProductLabel(`${product.name}`);
                      }}
                    >
                      {product.name} ({product.id})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                type="number"
                name="bonus_promo_discount"
                placeholder="Discount (i.e 20 = 20% additional discount)"
                value={formData.bonus_promo_discount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bonus_promo_discount: e.target.value,
                  })
                }
                className="border p-2 w-full"
                required
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedRegion}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                  {regionOptions.map((region) => (
                    <DropdownMenuItem
                      key={region.label}
                      onSelect={() => {
                        setFormData({
                          ...formData,
                          region: region.value,
                        });
                        setSelectedRegion(`${region.label}`);
                      }}
                    >
                      {region.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button type="submit">Add Product</Button>
            </form>
          </div>
        </CardContent>
      </Card>
      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}
      {success && (
        <div className="text-green-600 text-sm text-center">
          {success}
        </div>
      )}
      <div>
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
              <li key={item.flashsaleproductsid} className="border p-4 rounded">
                <p>
                  <strong>{item.products?.name}</strong>
                </p>
                <p>Region: {item.region}</p>
                <p>Discount: {item.bonus_promo_discount}%</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
