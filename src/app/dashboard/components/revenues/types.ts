import { LucideIcon } from 'lucide-react';

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface StatCardData {
  title: string;
  value: string;
  icon: LucideIcon;
}

export interface Transaction {
  id: string;
  date: string;
  user: string;
  type: 'subscription' | 'one-time' | 'refund';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}