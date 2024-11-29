// app/api/dashboard/engagement/route.ts
import { NextResponse } from 'next/server';
import { EngagementData, Activity, StatCardData2 } from '@/app/types/engagement';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const mockEngagementData: EngagementData[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  return {
    date: date.toISOString().split('T')[0],
    activeUsers: Math.floor(Math.random() * 1000) + 200,
    sessionDuration: Math.floor(Math.random() * 600) + 100,
    bounceRate: Math.floor(Math.random() * 30) + 20,
    engagement: Math.floor(Math.random() * 40) + 40
  };
}).reverse();

import { Users, Clock, Target, TrendingUp } from 'lucide-react';

const mockStatsData: StatCardData2[] = [
  {
    title: "Daily Active Users",
    value: "8,21249",
    change: "+12.3%",
    trend: "up",
    icon: Users
  },
  {
    title: "Avg. Session Duration",
    value: "12m 30s",
    change: "+5.2%",
    trend: "up",
    icon: Clock
  },
  {
    title: "Engagement Rate",
    value: "68.7%",
    change: "-2.1%",
    trend: "down",
    icon: Target
  },
  {
    title: "Growth Rate",
    value: "+12.3%",
    change: "+1.5%",
    trend: "up",
    icon: TrendingUp
  }
];
const mockActivityLogs: Activity[] = [
  {
    id: '1',
    user: 'John Smith',
    action: 'commented on',
    target: 'Ice Bucket Challenge',
    date: new Date().toISOString(),
    type: 'comment',
    status: 'completed'
  },
  {
    id: '2',
    user: 'Emma Wilson',
    action: 'shared',
    target: 'Dance Challenge',
    date: new Date(Date.now() - 300000).toISOString(),
    type: 'share',
    status: 'completed'
  },
  {
    id: '3',
    user: 'Michael Brown',
    action: 'liked',
    target: 'Fitness Challenge',
    date: new Date(Date.now() - 600000).toISOString(),
    type: 'like',
    status: 'completed'
  }
];

export async function GET() {
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    return NextResponse.json({
      chartData: mockEngagementData,
      statsData: mockStatsData,
      activities: mockActivityLogs
    });
  } catch {
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        chartData: [],
        statsData: [],
        activities: []
      },
      { status: 500 }
    );
  }
}