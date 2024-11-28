"use client";

import React, { useEffect, useState } from "react";
import { Loader2, DollarSign, TrendingUp, CreditCard, ArrowUpRight } from 'lucide-react';
import { RevenueStats } from "../components/revenues/RevenueStats";
import { RevenueChart } from "../components/revenues/RevenueChart";
import { TransactionTable } from "../components/revenues/TransactionTable";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types for API responses
interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface StatCardData {
  title: string;
  value: string;
  icon: string;  // Changed to string to match API response
}

interface Transaction {
  id: string;
  date: string;
  user: string;
  type: 'subscription' | 'one-time' | 'refund';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

interface RevenueApiResponse {
  chartData: RevenueData[];
  statsData: StatCardData[];
  transactions: Transaction[];
}

// Icon mapping
const iconMap = {
  DollarSign,
  TrendingUp,
  CreditCard,
  ArrowUpRight
};

export default function RevenuePage() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [statsData, setStatsData] = useState<StatCardData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/revenues');

        if (!response.ok) {
          throw new Error('Failed to fetch revenue data');
        }

        const data: RevenueApiResponse = await response.json();
        
        // Map the icon strings to actual icon components
        const processedStatsData = data.statsData.map(stat => ({
          ...stat,
          icon: iconMap[stat.icon as keyof typeof iconMap]
        }));

        setRevenueData(data.chartData);
        setStatsData(processedStatsData);
        setTransactions(data.transactions);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching revenue data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-full bg-gray-50/30 pb-12">
  {/* Max width wrapper */}
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* Content container with top padding */}
    <div className="pt-8">
      {/* Grid layout for dashboard components */}
      <div className="space-y-8">
        <RevenueStats stats={statsData} />
        <div className="grid gap-6 grid-cols-1">
          <RevenueChart data={revenueData} />
        </div>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  </div>
</div>
  );
}