import { LucideIcon } from 'lucide-react';

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface Transaction {
  id: string;
  date: string;
  user: string;
  amount: number;
  type: 'subscription' | 'in-app-purchase' | 'advertisement';
  status: 'completed' | 'pending' | 'failed';
}

export interface RevenueStat {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export interface RevenueChartProps {
  data: RevenueData[];
}

export interface TransactionTableProps {
  transactions: Transaction[];
}