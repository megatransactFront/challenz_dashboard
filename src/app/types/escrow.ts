// src/app/types/escrow.ts

export interface EscrowRow {
  id: string;
  businessName: string;
  location: string;
  phone: string;
  phoneBadge?: number;
  currency: string;
  currentEscrow: number;
  nextPayoutAt: string;
  missedPayoutAmount: number | null;
  missedPayoutWasSupposed: string | null;
  totalRevenue: number;
}

export interface EscrowDashboardData {
  rows: EscrowRow[];
}
