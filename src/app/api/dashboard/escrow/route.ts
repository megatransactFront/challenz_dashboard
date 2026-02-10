// src/app/api/dashboard/escrow/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { EscrowDashboardData, EscrowRow } from '@/app/types/escrow';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const todayIso = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// Function that returns the next payout date in the format of "Tue 10:00" or "Fri 10:00"
function getNextTueFriLabel(from: Date): string {
  const day = from.getDay();
  const hour = from.getHours();

  let daysUntilTue = (2 - day + 7) % 7;
  let daysUntilFri = (5 - day + 7) % 7;

  if (daysUntilTue === 0 && hour >= 10) daysUntilTue = 7;
  if (daysUntilFri === 0 && hour >= 10) daysUntilFri = 7;

  // Pick which one comes sooner
  const daysUntilNext = Math.min(daysUntilTue, daysUntilFri);

  const next = new Date(from);
  next.setDate(from.getDate() + daysUntilNext);

  const dayName = next.toLocaleDateString('en-US', { weekday: 'short' });
  return `${dayName} 10:00`;
}

// Function that formats the missed payout date in the format of "2026-02-06 10:00"
function formatMissedDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  return `${dateStr} 10:00`;
}

export async function GET() {
  try {
    const today = todayIso();
    const now = new Date();

    // 1) Fetch all business users
    const { data: businessUsers, error: usersError } = await supabase
      .from('users')
      .select('id, business_name, first_name, last_name, phone_number, location')
      .eq('role', 'business');

    if (usersError) throw usersError;
    if (!businessUsers?.length) {
      return NextResponse.json({ rows: [] } as EscrowDashboardData);
    }

    const merchantIds = businessUsers.map((u: { id: string }) => u.id);

    // 2) Fetch all escrow rows for these merchants
    const { data: escrowRows, error: escrowError } = await supabase
      .from('challenz_fee_escrow')
      .select('merchant_id, fee_amount, status, payout_date, currency')
      .in('merchant_id', merchantIds);

    if (escrowError) throw escrowError;

    // 3) Aggregate per merchant
    type EscrowAgg = {
      currentEscrow: number;
      missedAmount: number;
      earliestMissedDate: string | null; // the "earliest" missed payout date string (e.g. "2026-01-28")
      earliestMissedDateObj: Date | null; // the "earliest" missed payout date as a Date object
      totalRevenue: number;
      currency: string | null;
    };

    const escrowByMerchant = new Map<string, EscrowAgg>();
    for (const id of merchantIds) {
      escrowByMerchant.set(id, {
        currentEscrow: 0,
        missedAmount: 0,
        earliestMissedDate: null,
        earliestMissedDateObj: null,
        totalRevenue: 0,
        currency: null,
      });
    }

    for (const row of escrowRows ?? []) {
      const mid = row.merchant_id as string;
      const agg = escrowByMerchant.get(mid);
      if (!agg) continue;

      const amount = Number(row.fee_amount ?? 0);
      const status = row.status as string;
      const payoutDate = row.payout_date as string | null;
      const rowCurrency = (row.currency as string | null) || null;

      // Capture currency once per merchant
      if (!agg.currency && rowCurrency) {
        agg.currency = rowCurrency;
      }

      if (status === 'pending') {
        agg.currentEscrow += amount;

        // Check if the fee is overdue
        if (payoutDate && payoutDate < today) {
          agg.missedAmount += amount;

          // Track the "earliest" missed date to show when they first fell behind
          if (!agg.earliestMissedDate || payoutDate < agg.earliestMissedDate) {
            agg.earliestMissedDate = payoutDate;
            agg.earliestMissedDateObj = new Date(payoutDate + 'T10:00:00');
          }
        }
      }

      // Calculate the total revenue for the merchant
      if (status === 'paid') {
        agg.totalRevenue += amount;
      }
    }

    // 4) Build rows
    const rows: EscrowRow[] = businessUsers.map((u: {
      id: string;
      business_name: string | null;
      first_name: string;
      last_name: string;
      phone_number: string | null;
      location: string | null;
    }) => {
      const agg = escrowByMerchant.get(u.id) ?? {
        currentEscrow: 0,
        missedAmount: 0,
        earliestMissedDate: null,
        earliestMissedDateObj: null,
        totalRevenue: 0,
        currency: null,
      };

      const businessName =
        u.business_name?.trim() ||
        `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() ||
        '—';

      const location = u.location?.trim() || '—';
      const phone = u.phone_number?.trim() || '—';

      // Calculate the next payout date
      const nextPayoutAt = agg.earliestMissedDateObj !== null
        ? getNextTueFriLabel(agg.earliestMissedDateObj)
        : getNextTueFriLabel(now);

      return {
        id: u.id,
        businessName,
        location,
        phone,
        currency: agg.currency ?? 'USD',
        currentEscrow: Math.round(agg.currentEscrow * 100) / 100,
        nextPayoutAt,
        missedPayoutAmount:
          agg.missedAmount > 0
            ? Math.round(agg.missedAmount * 100) / 100
            : null,
        missedPayoutWasSupposed: formatMissedDate(agg.earliestMissedDate),
        totalRevenue: Math.round(agg.totalRevenue * 100) / 100,
      };
    });

    return NextResponse.json({ rows } as EscrowDashboardData);
  } catch (error) {
    console.error('Error in escrow API:', error);
    return NextResponse.json(
      { error: 'Failed to load escrow data' },
      { status: 500 }
    );
  }
}