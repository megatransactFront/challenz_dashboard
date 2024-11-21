// app/api/dashboard/stats/route.ts
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function formatValue(value: number, label: string): string {
  if (label === 'USD') {
    return `$${value.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }
  return `${value.toLocaleString()}${label ? ` ${label}` : ''}`;
}

export async function GET() {
  try {
    const rawStats = {
      totalRegistrations: {
        value: 1221325,
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

    // Add formatted values
    const statsData = {
      totalRegistrations: {
        ...rawStats.totalRegistrations,
        formatted: formatValue(rawStats.totalRegistrations.value, rawStats.totalRegistrations.label)
      },
      newUsers: {
        ...rawStats.newUsers,
        formatted: formatValue(rawStats.newUsers.value, rawStats.newUsers.label)
      },
      totalChallenges: {
        ...rawStats.totalChallenges,
        formatted: formatValue(rawStats.totalChallenges.value, rawStats.totalChallenges.label)
      },
      totalRevenue: {
        ...rawStats.totalRevenue,
        formatted: formatValue(rawStats.totalRevenue.value, rawStats.totalRevenue.label)
      }
    };

    return NextResponse.json(statsData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats data' },
      { status: 500 }
    );
  }
}