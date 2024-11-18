import { RevenueData, Transaction } from './types';

export const mockRevenueData: RevenueData[] = [
  { month: 'Jan', revenue: 45000, expenses: 28000, profit: 17000 },
  { month: 'Feb', revenue: 52000, expenses: 32000, profit: 20000 },
  { month: 'Mar', revenue: 49000, expenses: 30000, profit: 19000 },
  { month: 'Apr', revenue: 58000, expenses: 35000, profit: 23000 },
  { month: 'May', revenue: 55000, expenses: 34000, profit: 21000 },
  { month: 'Jun', revenue: 62000, expenses: 37000, profit: 25000 },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-03-15',
    user: 'John Doe',
    amount: 99.99,
    type: 'subscription',
    status: 'completed'
  },
  {
    id: '2',
    date: '2024-03-14',
    user: 'Jane Smith',
    amount: 49.99,
    type: 'in-app-purchase',
    status: 'completed'
  },
  {
    id: '3',
    date: '2024-03-14',
    user: 'Mike Johnson',
    amount: 299.99,
    type: 'advertisement',
    status: 'pending'
  },
  {
    id: '4',
    date: '2024-03-13',
    user: 'Sarah Wilson',
    amount: 79.99,
    type: 'subscription',
    status: 'failed'
  },
];