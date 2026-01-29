// src/app/types/loop-health.ts
export interface LoopHealthMetrics {
  completionRate: {
    value: number;        // 42
    change: string;       // "+3% WoW"
  };

  activeLoops: {
    value: number;        // 18,432
    change: string;       // "+1,204"
  };

  expiredLoops: {
    value: number;        // 31
    change: string;       // "+4%"
  };

  netUWCPerLoop: {
    value: number;        // -1.2
    status: string;       // "SAFE" or "RISK"
  };
}

export interface LoopFunnelStage {
  name: string;          // "Stage 1 Created"
  count: number;         // 12,340 or 7,640
  status?: 'unfinished' | 'completed' | 'expired';
}

export interface TimeChartPoint {
  day: string;    // "Mon", "Tue", "Wed"
  value: number;  // 2.1, 2.5, 1.8
}

export interface TimeCompletionSummary {
  average: number;       // 2.4 days
  median: number;        // 1.8 days
  percentile90: number;  // 4.5 days
}

export interface TimeCompletionData {
  timeSummary: TimeCompletionSummary;
  timeData: TimeChartPoint[];
}

export interface ExpiryBreakdownData {
  completed: number;     // 56%
  expired: number;       // 31%
}

export interface UWCFlowFunnelStage {
  name: string;         // "UWC Earned", "UWC Spent"
  count: number;        // 28,640 or 18,720
  netMinted?: number;
  netBurned?: number;
}

export interface LoopCategoryData {
  name: string;          // "Retail", "Restaurant"
  value: number;         // Percentage
  color: string;
}

export interface MerchantRiskAlert {
  merchantId: string;    // "M-1023"
  category: string;      // "Supermarket"
  completionRate: number; // 81
  discount: number;      // $4,230
  flag: 'high' | 'medium' | 'low';
}

// Main response from API
export interface LoopHealthData {
  metrics: LoopHealthMetrics;
  loopFunnelData: LoopFunnelStage[];
  timeCompletionData: TimeCompletionData;
  expiryBreakdownData: ExpiryBreakdownData;
  uwcFlowFunnelData: UWCFlowFunnelStage[];
  categories: LoopCategoryData[];
  merchantAlerts: MerchantRiskAlert[];
}