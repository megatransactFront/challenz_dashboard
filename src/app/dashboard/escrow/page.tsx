"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Phone, ChevronDown, AlertCircle, Loader2 } from "lucide-react";
import type { EscrowRow } from "@/app/types/escrow";

// Function that formats a value in a given currency code
function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function EscrowDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<EscrowRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [payoutFilter, setPayoutFilter] = useState<"all" | "missed">("all");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  // Fetch the data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await fetch('/api/dashboard/escrow', { method: 'POST' });
        const response = await fetch("/api/dashboard/escrow");
        if (!response.ok) throw new Error("Failed to fetch escrow data");
        const json = await response.json();
        setData(json.rows ?? []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter the rows based on the search query and payout filter
  const filteredRows = useMemo(() => {
    const rows = data ?? [];
    let filtered = [...rows];

    if (payoutFilter === "missed") {
      filtered = filtered.filter((r) => r.missedPayoutAmount != null);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.businessName.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""))
      );
    }

    return filtered;
  }, [data, searchQuery, payoutFilter]);

  // Calculate the totals for the filtered rows
  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => ({
        currentEscrow: acc.currentEscrow + r.currentEscrow,
        missedPayout: acc.missedPayout + (r.missedPayoutAmount ?? 0),
        totalRevenue: acc.totalRevenue + r.totalRevenue,
      }),
      { currentEscrow: 0, missedPayout: 0, totalRevenue: 0 }
    );
  }, [filteredRows]);

  // Choose a display currency (assumes a single currency; falls back to USD)
  const displayCurrency = filteredRows[0]?.currency ?? "USD";

  // Handle the row click to navigate to the detail page
  const handleRowClick = (row: EscrowRow) => {
    router.push(`/dashboard/escrow/${row.id}`);
  };

  // Show the loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show the error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Escrow Dashboard</h1>
        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 shadow-sm"
          >
            {payoutFilter === "all" ? "All businesses" : "Only with missed payouts"}
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${filterDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          {filterDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                aria-hidden
                onClick={() => setFilterDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1 min-w-[14rem] w-56 bg-white border border-gray-300 rounded-lg shadow-xl z-50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setPayoutFilter("all");
                    setFilterDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${payoutFilter === "all" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  All businesses
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPayoutFilter("missed");
                    setFilterDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${payoutFilter === "missed" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  Only with missed payouts
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search: Business name / Phone / Location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
        />
      </div>

      {/* Table Section */}
      {filteredRows.length === 0 ? (
        <div className="bg-white rounded-xl shadow border border-gray-200 px-6 py-12 text-center text-gray-500">
          No businesses match your filters or search.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">

              {/* Table Header */}
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-center px-4 py-3 text-md font-semibold text-black border border-gray-200">
                    Business
                  </th>
                  <th className="text-center px-4 py-3 text-md font-semibold text-black border border-gray-200">
                    Phone
                  </th>
                  <th className="text-center px-4 py-3 text-md font-semibold text-black border border-gray-200">
                    Current Escrow (Next Payout)
                  </th>
                  <th className="text-center px-4 py-3 text-md font-semibold text-black border border-gray-200">
                    Missed Payout
                  </th>
                  <th className="text-center px-4 py-3 text-md font-semibold text-black border border-gray-200">
                    Total Revenue (All Time)
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row)}
                    className="bg-white hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {/* Business Name and Location Column */}
                    <td className="px-4 py-3 border border-gray-200 align-top max-w-[220px]">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate" title={row.businessName}>
                          {row.businessName}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5 truncate" title={row.location}>
                          {row.location}
                        </p>
                      </div>
                    </td>

                    {/* Phone Column */}
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <div className="flex items-center justify-center gap-2 min-w-0">
                        <Phone size={14} className="text-black font-medium shrink-0" />
                        <span className="text-gray-800 font-medium truncate max-w-[120px]" title={row.phone}>
                          {row.phone}
                        </span>
                      </div>
                    </td>

                    {/* Current Escrow Column */}
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(row.currentEscrow, row.currency)}
                        </p>
                        <p className="text-sm text-gray-700 mt-0.5 truncate" title={`Next: ${row.nextPayoutAt}`}>
                          (Next: {row.nextPayoutAt})
                        </p>
                      </div>
                    </td>

                    {/* Missed Payout Column */}
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      {row.missedPayoutAmount != null ? (
                        <div className="min-w-0">
                          <p className="flex items-center justify-center gap-1.5 text-red-600 font-medium">
                            <AlertCircle size={14} className="shrink-0" />
                            {formatCurrency(row.missedPayoutAmount, row.currency)}
                            {row.missedPayoutCount > 1 && (
                              <span className="text-sm text-red-500">
                                ({row.missedPayoutCount})
                              </span>
                            )}
                          </p>
                          {row.missedPayoutWasSupposed && (
                            <p className="text-sm text-red-500 font-medium mt-0.5 truncate" title={row.missedPayoutWasSupposed}>
                              Was supposed: {row.missedPayoutWasSupposed}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-700">—</span>
                      )}
                    </td>

                    {/* Total Revenue Column */}
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(row.totalRevenue, row.currency)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Table Footer */}
              <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td colSpan={2} className="px-4 py-3 text-gray-900 border border-gray-200 text-center">
                    Total of Totals
                  </td>
                  <td className="px-4 py-3 text-gray-900 border border-gray-200 text-center">
                    {formatCurrency(totals.currentEscrow, displayCurrency)}
                  </td>
                  <td className="px-4 py-3 text-red-600 border border-gray-200 text-center">
                    {formatCurrency(totals.missedPayout, displayCurrency)}
                  </td>
                  <td className="px-4 py-3 text-gray-900 border border-gray-200 text-center">
                    {formatCurrency(totals.totalRevenue, displayCurrency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
