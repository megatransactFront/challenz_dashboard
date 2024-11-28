// app/api/dashboard/revenues/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const data = {
      chartData: [
        { month: "Jan", revenue: 45000, expenses: 28000, profit: 17000 },
        { month: "Feb", revenue: 52000, expenses: 32000, profit: 20000 },
        { month: "Mar", revenue: 49000, expenses: 30000, profit: 19000 },
        { month: "Apr", revenue: 58000, expenses: 35000, profit: 23000 },
        { month: "May", revenue: 55000, expenses: 34000, profit: 21000 },
        { month: "Jun", revenue: 62000, expenses: 37000, profit: 25000 },
      ],
      statsData: [
        {
          title: "Total Revenue",
          value: "$321,231.89",
          // Don't send the actual icon component, just the name
          icon: "DollarSign"
        },
        {
          title: "Monthly Growth",
          value: "+12.5%",
          icon: "TrendingUp"
        },
        {
          title: "Transactions",
          value: "1,205",
          icon: "CreditCard"
        },
        {
          title: "Avg. Transaction",
          value: "$242.89",
          icon: "ArrowUpRight"
        }
      ],
      transactions: [
        {
          id: "tx_1",
          date: "2024-03-28",
          user: "John Doe",
          type: "subscription",
          amount: 299.99,
          status: "completed"
        },
        {
          id: "tx_2",
          date: "2024-03-28",
          user: "Alice Smith",
          type: "one-time",
          amount: 599.99,
          status: "completed"
        },
        {
          id: "tx_3",
          date: "2024-03-27",
          user: "Bob Johnson",
          type: "subscription",
          amount: 199.99,
          status: "pending"
        },
        {
          id: "tx_4",
          date: "2024-03-27",
          user: "Emma Wilson",
          type: "refund",
          amount: -99.99,
          status: "completed"
        },
        {
          id: "tx_5",
          date: "2024-03-26",
          user: "Michael Brown",
          type: "one-time",
          amount: 899.99,
          status: "failed"
        }
      ]
    };

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}