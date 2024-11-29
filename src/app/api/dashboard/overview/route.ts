// app/api/dashboard/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

type Stat = {
  value: number;
  label: string;
  formatted?: string;
};

type Stats = {
  totalRegistrations: Stat;
  newUsers: Stat;
  totalChallenges: Stat;
  totalRevenue: Stat;
};

type UserData = {
  month: string;
  totalUsers: number;
  newUsers: number;
};

type DashboardResponse = {
  stats: Stats;
  userData: UserData[];
};

function formatValue(value: number, label: string): string {
  try {
    if (typeof value !== 'number') {
      throw new Error('Invalid value type');
    }
    if (label === 'USD') {
      return `$${value.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    }
    return `${value.toLocaleString()}${label ? ` ${label}` : ''}`;
  } catch {
    return '0'; // Fallback value
  }
}

function getRawStats(): Stats {
  return {
    totalRegistrations: {
      value: 22122215,
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
}

function getUserData(): UserData[] {
  return [
    { month: 'Jan', totalUsers: 8000, newUsers: 2000 },
    { month: 'Feb', totalUsers: 7000, newUsers: 1500 },
    { month: 'Mar', totalUsers: 6000, newUsers: 1200 },
    { month: 'Apr', totalUsers: 9000, newUsers: 2500 },
    { month: 'May', totalUsers: 7500, newUsers: 1800 },
    { month: 'Jun', totalUsers: 8500, newUsers: 2000 },
    { month: 'Jul', totalUsers: 7800, newUsers: 1600 },
    { month: 'Aug', totalUsers: 8200, newUsers: 1900 },
    { month: 'Sep', totalUsers: 9500, newUsers: 2800 },
    { month: 'Oct', totalUsers: 8800, newUsers: 2200 },
    { month: 'Nov', totalUsers: 9200, newUsers: 2400 },
    { month: 'Dec', totalUsers: 9800, newUsers: 2600 }
  ];
}

export async function GET(): Promise<NextResponse<DashboardResponse>> {
  try {
    // Get raw stats and format them
    const rawStats = getRawStats();
    const statsData = Object.entries(rawStats).reduce((acc, [key, stat]) => ({
      ...acc,
      [key]: {
        ...stat,
        formatted: formatValue(stat.value, stat.label)
      }
    }), {} as Stats);

    // Get user data
    const userData = getUserData();

    // Return combined response
    return NextResponse.json({
      stats: statsData,
      userData: userData
    });
  } catch {
    // Return empty data if something goes wrong
    return NextResponse.json({
      stats: {
        totalRegistrations: { value: 0, label: "Users", formatted: "0 Users" },
        newUsers: { value: 0, label: "Users", formatted: "0 Users" },
        totalChallenges: { value: 0, label: "", formatted: "0" },
        totalRevenue: { value: 0, label: "USD", formatted: "$0.00" }
      },
      userData: []
    });
  }
}