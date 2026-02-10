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
  missedPayoutCount: number;
  totalRevenue: number;
}

export interface EscrowDashboardData {
  rows: EscrowRow[];
}

export type EscrowStatus = 'pending' | 'missed' | 'paid';

export type BusinessUserRow = {
  id: string;
  business_name: string | null;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  location: string | null;
};

export type EscrowAgg = {
  currentEscrow: number;
  missedAmount: number;
  missedCount: number;
  earliestMissedDate: string | null;
  earliestMissedDateObj: Date | null;
  totalRevenue: number;
  currency: string | null;
};

export interface EscrowLedgerRow {
  id: number;
  dateLabel: string;
  createdAt: string;
  typeLabel: string;
  amount: number;
  currency: string;
  orderId: string | null;
  payoutBatchId: string | null;
  paymentReceiptNumber: string | null;
  paidAt: string | null;
  status: EscrowStatus;
}

export interface EscrowDetailSummary {
  merchantId: string;
  businessName: string;
  location: string;
  phone: string;
  currency: string;
  currentEscrow: number;
  missedPayoutAmount: number;
  missedCount: number;
  missedWasSupposed: string | null;
  nextPayoutAt: string;
  totalRevenue: number;
}

export interface EscrowDetailData {
  summary: EscrowDetailSummary;
  ledger: EscrowLedgerRow[];
}