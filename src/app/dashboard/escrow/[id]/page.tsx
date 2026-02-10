"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Phone, MessageCircle } from "lucide-react";
import type { EscrowDetailData, EscrowLedgerRow } from "@/app/types/escrow";

// Reuse currency formatter from the dashboard page
function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function classNames(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type LedgerFilter = "all" | "received" | "pending" | "missed";

export default function EscrowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params.id as string;

  const [data, setData] = useState<EscrowDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<LedgerFilter>("all");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/dashboard/escrow/${merchantId}`);
        if (!response.ok) {
          throw new Error("Failed to load escrow detail");
        }
        const json: EscrowDetailData = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (merchantId) {
      fetchDetail();
    }
  }, [merchantId]);

  const filteredLedger: EscrowLedgerRow[] = useMemo(() => {
    if (!data) return [];

    if (filter === "all") return data.ledger;

    return data.ledger.filter((row) => {
      if (filter === "received") return row.status === "paid";
      if (filter === "pending") return row.status === "pending";
      if (filter === "missed") return row.status === "missed";
      return true;
    });
  }, [data, filter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="h-8 w-8 border-2 border-t-transparent border-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard/escrow")}
          className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Escrow Dashboard
        </button>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error ?? "Failed to load escrow detail."}
        </div>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.push("/dashboard/escrow")}
        className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <ArrowLeft size={18} />
        View All Businesses
      </button>

      {/* Header card: business info + contact */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-lg shrink-0">
            {summary.businessName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              {summary.businessName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{summary.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right text-sm text-gray-500 mr-2">
            <span className="font-medium text-gray-800">Contact</span>
            <span>{summary.phone}</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          >
            <Phone size={16} />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
          >
            <MessageCircle size={16} />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Escrow */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Current Escrow
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(summary.currentEscrow, summary.currency)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Next payout: <span className="font-medium text-gray-700">{summary.nextPayoutAt}</span>
          </p>
        </div>

        {/* Missed Payout */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Missed Payout
          </p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {formatCurrency(summary.missedPayoutAmount, summary.currency)}
            {summary.missedCount > 1 && (
              <span className="ml-1 text-sm text-red-500">
                ({summary.missedCount})
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-red-500 font-medium">
            {summary.missedWasSupposed
              ? `Was supposed: ${summary.missedWasSupposed}`
              : "No missed payouts"}
          </p>
        </div>

        {/* Pending Funds */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Pending Funds
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(summary.currentEscrow - summary.missedPayoutAmount, summary.currency)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Funds held in upcoming payouts
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Total Revenue
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(summary.totalRevenue, summary.currency)}
          </p>
          <p className="mt-1 text-xs text-gray-500">All time</p>
        </div>
      </div>

      {/* Ledger header + filters */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="font-semibold text-gray-900 text-sm sm:text-base">
            Escrow Ledger
          </div>
          <div className="flex gap-1 sm:gap-2 text-xs sm:text-sm">
            {(["all", "received", "pending", "missed"] as LedgerFilter[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={classNames(
                  "px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm font-medium cursor-pointer",
                  filter === key
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
              >
                {key === "all" && "All"}
                {key === "received" && "Received"}
                {key === "pending" && "Pending"}
                {key === "missed" && "Missed"}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger table */}
        {filteredLedger.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500 text-sm">
            No escrow entries match this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-md font-semibold text-black border border-gray-200 text-left">
                    Date
                  </th>
                  <th className="px-4 py-3 text-md font-semibold text-black border border-gray-200 text-left">
                    Type
                  </th>
                  <th className="px-4 py-3 text-md font-semibold text-black border border-gray-200 text-center">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-md font-semibold text-black border border-gray-200 text-center">
                    Reference
                  </th>
                  <th className="px-4 py-3 text-md font-semibold text-black border border-gray-200 text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.map((row) => {
                  const isMissed = row.status === "missed";
                  const isPaid = row.status === "paid";
                  const isPending = row.status === "pending";
                  return (
                    <tr
                      key={row.id}
                      className="bg-white hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-base border border-gray-200 align-top text-gray-800 font-medium whitespace-nowrap">
                        {row.dateLabel}
                      </td>
                      <td className="px-4 py-3 border border-gray-200 align-top">
                        <div className="text-gray-900 font-medium">{row.typeLabel}</div>
                        <div className="mt-0.5 text-xs text-gray-500 space-y-0.5">
                          {row.orderId && <div>Order: {row.orderId}</div>}
                          {row.payoutBatchId && <div>Batch: {row.payoutBatchId}</div>}
                        </div>
                      </td>
                      <td className="px-4 py-3 border border-gray-200 align-top text-center font-medium text-gray-900 whitespace-nowrap">
                        {formatCurrency(row.amount, row.currency)}
                      </td>
                      <td className="px-4 py-3 border border-gray-200 align-top text-center">
                        <div className="text-sm text-gray-900 space-y-0.5">
                          <div>
                            {row.paymentReceiptNumber
                              ? `Receipt: ${row.paymentReceiptNumber}`
                              : "—"}
                          </div>
                          {isPaid && (
                            <div className="text-sm text-gray-700">
                              Paid at:{" "}
                              <span className="font-medium text-gray-700">
                                {row.paidAt ?? "-"}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 border border-gray-200 align-top text-center">
                        <span
                          className={classNames(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium",
                            isMissed && "bg-red-50 text-red-700",
                            isPaid && "bg-emerald-50 text-emerald-700",
                            isPending && "bg-yellow-50 text-yellow-800"
                          )}
                        >
                          {isMissed && "Missed"}
                          {isPaid && "Received"}
                          {isPending && "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

