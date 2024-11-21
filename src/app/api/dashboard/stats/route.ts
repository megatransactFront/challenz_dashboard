import { NextResponse } from 'next/server';

export async function GET() {
  const stats = {
    totalRegistrations: {
      value: 115,
      label: "Users"
    },
    newUsers: {
      value: 154,
      label: "Users"
    },
    totalChallenges: {
      value: 7560,
      label: ""
    },
    totalRevenue: {
      value: 10450.00,
      label: "USD"
    }
  };

  return NextResponse.json(stats);
}