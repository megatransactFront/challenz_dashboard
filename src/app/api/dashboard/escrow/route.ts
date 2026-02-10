// src/app/api/dashboard/escrow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { EscrowDashboardData, BusinessUserRow } from '@/app/types/escrow';
import {
  aggregateEscrowByMerchant,
  buildDashboardRow,
} from './utils';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
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

    const aggMap = aggregateEscrowByMerchant(
      merchantIds,
      (escrowRows ?? []) as any[]
    );
    const now = new Date();

    // 3) Build rows
    const rows = (businessUsers as BusinessUserRow[]).map((u) =>
      buildDashboardRow(u, aggMap.get(u.id), now)
    );

    return NextResponse.json({ rows } as EscrowDashboardData);
  } catch (error) {
    console.error('Error in escrow API:', error);
    return NextResponse.json(
      { error: 'Failed to load escrow data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get('merchant_id');

    let query = supabase
      .from('challenz_fee_escrow')
      .update({ status: 'missed' })
      .eq('status', 'pending')
      .lt('payout_date', today)
      .not('payout_date', 'is', null);

    if (merchantId) {
      query = query.eq('merchant_id', merchantId);
    }

    const { data: updatedRows, error } = await query.select(
      'id, merchant_id, fee_amount, payout_date, status'
    );

    if (error) {
      console.error('mark-missed error:', error);
      return NextResponse.json(
        { error: 'Failed to update escrow statuses', details: error.message },
        { status: 500 }
      );
    }

    const count = updatedRows?.length ?? 0;

    return NextResponse.json({
      success: true,
      updatedCount: count,
      message: count === 0
        ? 'No overdue fees found. Nothing was updated.'
        : `Marked ${count} fee(s) as missed.`,
    });

  } catch (error) {
    console.error('POST escrow error:', error);
    return NextResponse.json(
      { error: 'Unexpected error occurred' },
      { status: 500 }
    );
  }
}