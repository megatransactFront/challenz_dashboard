// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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

function getRawStats() {
  return {
    totalRegistrations: {
      value: 12215,
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

export async function GET() {
  try {
    const rawStats = getRawStats();

    const statsData = Object.entries(rawStats).reduce((acc, [key, stat]) => ({
      ...acc,
      [key]: {
        ...stat,
        formatted: formatValue(stat.value, stat.label)
      }
    }), {});

    return NextResponse.json(statsData);
  } catch {
    // Return empty stats with zero values if something goes wrong
    return NextResponse.json({
      totalRegistrations: { value: 0, label: "Users", formatted: "0 Users" },
      newUsers: { value: 0, label: "Users", formatted: "0 Users" },
      totalChallenges: { value: 0, label: "", formatted: "0" },
      totalRevenue: { value: 0, label: "USD", formatted: "$0.00" }
    });
  }
}