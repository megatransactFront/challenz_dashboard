"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function EscrowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.push("/dashboard/escrow")}
        className="cursor-pointer flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
      >
        <ArrowLeft size={18} />
        Back to Escrow Dashboard
      </button>
      <div className="bg-white rounded-xl shadow border border-gray-200 p-8">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Business / Merchant Details</h1>
        <p className="text-gray-500">
          Details for business ID: <span className="font-mono font-medium text-gray-700">{id}</span>
        </p>
      </div>
    </div>
  );
}
