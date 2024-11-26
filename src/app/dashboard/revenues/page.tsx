"use client";

import React from "react";
import { RevenueStats } from "../components/revenues/RevenueStats";
import { RevenueChart } from "../components/revenues/RevenueChart";
import { TransactionTable } from "../components/revenues/TransactionTable";
import type { RevenueData } from "../components/revenues/types";

// Mock data
const mockRevenueData: RevenueData[] = [
  { month: "Jan", revenue: 45000, expenses: 28000, profit: 17000 },
  { month: "Feb", revenue: 52000, expenses: 32000, profit: 20000 },
  { month: "Mar", revenue: 49000, expenses: 30000, profit: 19000 },
  { month: "Apr", revenue: 58000, expenses: 35000, profit: 23000 },
  { month: "May", revenue: 55000, expenses: 34000, profit: 21000 },
  { month: "Jun", revenue: 62000, expenses: 37000, profit: 25000 },
];

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <RevenueStats />
      <div className="grid gap-6 grid-cols-1">
        <RevenueChart data={mockRevenueData} />
      </div>
      <TransactionTable transactions={[]} />
    </div>
  );
}
