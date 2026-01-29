// src/app/types/onboarding-summary.ts

export interface SummaryMetric {
  value: number;
  change: number; 
  trend: 'up' | 'down';
}

export interface ChartPoint {
  date: string;
  value: number;
}

export interface SummaryCard {
  title: string;
  metric: SummaryMetric;
  chartData: ChartPoint[];
}

export interface TableRow {
  date: string;
  country: string;
  countryCode: string;
  city: string;
  newUsers: number;
  newMerchants: number;
  stage2LoopsClosed: number;
}

export interface OnboardingSummaryData {
  cards: {
    newUsers: SummaryCard;
    newMerchants: SummaryCard;
    stage2LoopsClosed: SummaryCard;
  };
  tableData: TableRow[];
}