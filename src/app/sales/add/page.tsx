"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Notification from "@/components/ui/notification";

export default function AddProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_time: "",
    end_time: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: ["name", "description"].includes(name)
        ? capitalizeFirst(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      formData.name.charAt(0).toUpperCase();
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(
          "Failed to add flash sale event: " + (data.error || "Unknown error")
        );
      } else {
        setSuccess("Flash sale event added successfully!");
        setTimeout(() => {
          router.push("/sales");
        }, 900);
      }
    } catch (err: any) {
      setError("Failed to add flash sale event: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="p-8">
          <h1 className="text-2xl font-semibold mb-1 text-center">
            Add a Flash Sale
          </h1>

          <form onSubmit={handleSubmit} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              placeholder="Name"
              onChange={handleChange}
              required
              className="w-full"
            />
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              name="description"
              value={formData.description}
              placeholder="Description"
              onChange={handleChange}
              className="w-full"
            />
            <label className="block text-sm font-medium text-gray-700">
              Start Time <span className="text-red-500">*</span>
            </label>
            <Input
              name="start_time"
              value={formData.start_time}
              placeholder="Start Time"
              onChange={handleChange}
              type="date"
              required
              className="w-full"
            />
            <label className="block text-sm font-medium text-gray-700">
              End Time <span className="text-red-500">*</span>
            </label>
            <Input
              name="end_time"
              value={formData.end_time}
              placeholder="End Time"
              onChange={handleChange}
              type="date"
              className="w-full"
            />
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

            <div className="flex justify-center">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
