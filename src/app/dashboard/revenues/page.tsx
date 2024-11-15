"use client"

import React from 'react';
import { RevenueStats } from '../components/revenues/RevenueStats';
import { RevenueChart } from '../components/revenues/RevenueChart';
import { TransactionTable } from '../components/revenues/TransactionTable';
import { mockRevenueData, mockTransactions } from '../components/revenues/mock-data';

export default function RevenuesPage() {
  return (
    <div className="space-y-6">
      <RevenueStats />
      
      <div className="grid gap-6 grid-cols-1">
        <RevenueChart data={mockRevenueData} />
      </div>

      <TransactionTable transactions={mockTransactions} />
    </div>
  );
}