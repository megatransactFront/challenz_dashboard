import type {
  EscrowRow,
  EscrowDetailSummary,
  EscrowStatus,
  EscrowAgg,
  BusinessUserRow,
} from '@/app/types/escrow';

export function createEmptyAgg(): EscrowAgg {
  return {
    currentEscrow: 0,
    missedAmount: 0,
    missedCount: 0,
    earliestMissedDate: null,
    earliestMissedDateObj: null,
    totalRevenue: 0,
    currency: null,
  };
}

// Shared helper: next Tue or Fri at 10:00
export function getNextTueFriLabel(from: Date): string {
  const day = from.getDay();
  const hour = from.getHours();

  let daysUntilTue = (2 - day + 7) % 7;
  let daysUntilFri = (5 - day + 7) % 7;

  if (daysUntilTue === 0 && hour >= 10) daysUntilTue = 7;
  if (daysUntilFri === 0 && hour >= 10) daysUntilFri = 7;

  const daysUntilNext = Math.min(daysUntilTue, daysUntilFri);

  const next = new Date(from);
  next.setDate(from.getDate() + daysUntilNext);

  const dayName = next.toLocaleDateString('en-US', { weekday: 'short' });
  return `${dayName} 10:00`;
}

export function formatMissedDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  return `${dateStr} 10:00`;
}

// Aggregate raw challenz_fee_escrow rows by merchant id
export function aggregateEscrowByMerchant(
  merchantIds: string[],
  escrowRows: {
    merchant_id: string;
    fee_amount: number | string | null;
    status: EscrowStatus | string | null;
    payout_date: string | null;
    currency: string | null;
  }[]
): Map<string, EscrowAgg> {
  const map = new Map<string, EscrowAgg>();

  for (const id of merchantIds) {
    map.set(id, createEmptyAgg());
  }

  for (const row of escrowRows ?? []) {
    const mid = row.merchant_id;
    const agg = map.get(mid);
    if (!agg) continue;

    const amount = Number(row.fee_amount ?? 0);
    const status = ((row.status as string | null) ?? 'pending').toLowerCase() as EscrowStatus;
    const payoutDate = row.payout_date;
    const rowCurrency = row.currency ?? null;

    if (!agg.currency && rowCurrency) {
      agg.currency = rowCurrency;
    }

    if (status === 'pending' || status === 'missed') {
      agg.currentEscrow += amount;
    }

    if (status === 'missed') {
      agg.missedAmount += amount;
      agg.missedCount += 1;

      if (payoutDate && (!agg.earliestMissedDate || payoutDate < agg.earliestMissedDate)) {
        agg.earliestMissedDate = payoutDate;
        agg.earliestMissedDateObj = new Date(payoutDate + 'T10:00:00');
      }
    }

    if (status === 'paid') {
      agg.totalRevenue += amount;
    }
  }

  return map;
}

// Build a single dashboard row from user + aggregate
export function buildDashboardRow(
  user: BusinessUserRow,
  aggInput: EscrowAgg | undefined,
  now: Date
): EscrowRow {
  const agg = aggInput ?? createEmptyAgg();

  const businessName =
    user.business_name?.trim() ||
    `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() ||
    '—';

  const location = user.location?.trim() || '—';
  const phone = user.phone_number?.trim() || '—';

  const nextPayoutAt =
    agg.earliestMissedDateObj !== null
      ? getNextTueFriLabel(agg.earliestMissedDateObj)
      : getNextTueFriLabel(now);

  return {
    id: user.id,
    businessName,
    location,
    phone,
    currency: agg.currency ?? 'USD',
    currentEscrow: Math.round(agg.currentEscrow * 100) / 100,
    nextPayoutAt,
    missedPayoutAmount:
      agg.missedAmount > 0 ? Math.round(agg.missedAmount * 100) / 100 : null,
    missedPayoutWasSupposed: formatMissedDate(agg.earliestMissedDate),
    missedPayoutCount: agg.missedCount,
    totalRevenue: Math.round(agg.totalRevenue * 100) / 100,
  };
}

// Build the summary header for a single merchant detail page
export function buildDetailSummary(
  user: BusinessUserRow,
  aggInput: EscrowAgg | undefined,
  now: Date
): EscrowDetailSummary {
  const agg = aggInput ?? createEmptyAgg();

  const businessName =
    user.business_name?.trim() ||
    `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() ||
    '—';

  return {
    merchantId: user.id,
    businessName,
    location: user.location?.trim() || '—',
    phone: user.phone_number?.trim() || '—',
    currency: agg.currency ?? 'USD',
    currentEscrow: Math.round(agg.currentEscrow * 100) / 100,
    missedPayoutAmount: Math.round(agg.missedAmount * 100) / 100,
    missedCount: agg.missedCount,
    missedWasSupposed: formatMissedDate(agg.earliestMissedDate),
    nextPayoutAt: getNextTueFriLabel(now),
    totalRevenue: Math.round(agg.totalRevenue * 100) / 100,
  };
}

