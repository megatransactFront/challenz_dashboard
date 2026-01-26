// src/app/api/dashboard/loop-health/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Mock data for loop health dashboard
    const mockData = {
      metrics: {
        completionRate: {
          value: 42,
          change: "+3% WoW"
        },
        activeLoops: {
          value: 18432,
          change: "+1,204"
        },
        expiredLoops: {
          value: 31,
          change: "+4%"
        },
        netUWCPerLoop: {
          value: -1.2,
          status: "SAFE"
        }
      },
      loopFunnelData: [
        { name: "Stage 1 Created", count: 12340, status: 'unfinished' },
        { name: "Stage 2 Created", count: 7640, status: 'unfinished' },
        { name: "Completed", count: 5280, status: 'completed' },
        { name: "Expired", count: 3920, status: 'expired' },
        { name: "Abandoned", count: 860, status: 'unfinished' }
      ],
      timeCompletionData: {
        timeSummary: {
          average: 2.4,
          median: 1.8,
          percentile90: 4.5
        },
        timeData: [
          { day: "Mon", value: 2.1 },
          { day: "Tue", value: 2.5 },
          { day: "Wed", value: 1.8 },
          { day: "Thu", value: 2.3 },
          { day: "Fri", value: 2.0 },
          { day: "Sat", value: 2.4 },
          { day: "Sun", value: 2.2 }
        ]
      },
      expiryBreakdownData: {
        completed: 56,
        expired: 31,
        other: 13
      },
      uwcFlowFunnelData: [
        { name: "UWC Earned", count: 28640, },
        { name: "UWC Spent", count: 18720, },
        { name: "UWC Burned", count: 15680 },
        { name: "Net UWC per Loop", count: -1.2, netMinted: 6200, netBurned: 7150 },
      ],
      categories: [
        { name: "Retail", value: 35, color: "#3a7231" },
        { name: "Supermarket", value: 30, color: "#354fbd" },
        { name: "Restaurant", value: 25, color: "#519945" },
        { name: "Transport", value: 20, color: "#fbbb01" },
        { name: "Bill Payments", value: 15, color: "#ef7917" },
        { name: "Other", value: 10, color: "#c35903" }
      ],
      merchantAlerts: [
        { merchantId: "M-1023", category: "Supermarket", completionRate: 81, discount: 4230, flag: "high" as const },
        { merchantId: "M-4411", category: "Restaurant", completionRate: 18, discount: 120, flag: "medium" as const },
        { merchantId: "M-8891", category: "Retail", completionRate: 67, discount: 980, flag: "low" as const }
      ]
    };

    return NextResponse.json(mockData);

  } catch (error) {
    console.error('Error fetching loop health data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loop health data' },
      { status: 500 }
    );
  }
}