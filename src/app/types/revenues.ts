

// types/revenue.ts
export interface RevenueData {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }
  
  export interface RevenueChartProps {
    data: RevenueData[];
  }
  
  export interface Transaction {
    id: string;
    date: string;
    user: string;
    type: 'subscription' | 'one-time' | 'refund';
    amount: number;
    status: 'completed' | 'pending' | 'failed';
  }
  
  export interface TransactionTableProps {
    transactions: Transaction[];
  }
