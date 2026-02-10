import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type {
  EscrowDetailData,
  EscrowLedgerRow,
  EscrowStatus,
  BusinessUserRow,
} from '@/app/types/escrow';
import {
  aggregateEscrowByMerchant,
  buildDetailSummary,
} from '../utils';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Format a timestamp into a friendly label like "Today, 14:08" or "Mon, Feb 2"
function formatLedgerDateLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();

  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (isToday) {
    return `Today, ${time}`;
  }

  const dayPart = d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  return `${dayPart}, ${time}`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: merchantId } = await params;
    if (!merchantId) {
      return NextResponse.json(
        { error: 'Missing merchant id' },
        { status: 400 }
      );
    }

    // 1) Fetch the merchant (business user)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, business_name, first_name, last_name, phone_number, location')
      .eq('id', merchantId)
      .eq('role', 'business')
      .maybeSingle();

    if (userError) {
      console.error('Escrow detail user error:', userError);
      return NextResponse.json(
        { error: 'Failed to load merchant' },
        { status: 500 }
      );
    }
    if (!user) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // 2) Fetch all escrow rows for this merchant
    const { data: escrowRows, error: escrowError } = await supabase
      .from('challenz_fee_escrow')
      .select(
        'id, merchant_id, fee_amount, currency, status, payout_date, created_at, paid_at, order_id, payout_batch_id, payment_receipt_number'
      )
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });

    if (escrowError) {
      console.error('Escrow detail rows error:', escrowError);
      return NextResponse.json(
        { error: 'Failed to load escrow rows' },
        { status: 500 }
      );
    }

    const rows = escrowRows ?? [];

    // Ensure rows passed to aggregator include merchant_id
    const rowsWithMerchant = rows.map((r) => ({
      ...r,
      merchant_id: r.merchant_id ?? merchantId,
    }));

    const aggMap = aggregateEscrowByMerchant([merchantId], rowsWithMerchant as any[]);
    const now = new Date();

    const summary = buildDetailSummary(
      user as BusinessUserRow,
      aggMap.get(merchantId),
      now
    );

    // 3) Build ledger rows
    const ledger: EscrowLedgerRow[] = rows.map((r) => {
      const createdAt = (r.created_at as string) ?? new Date().toISOString();
      const paidAtRaw = (r.paid_at as string | null) ?? null;
      const status = ((r.status as string | null) ?? 'pending').toLowerCase() as EscrowStatus;

      let typeLabel: string;
      if (status === 'paid') {
        typeLabel = 'Payment Received';
      } else if (status === 'missed') {
        typeLabel = 'Missed Payout';
      } else {
        typeLabel = 'Pending Payout';
      }

      return {
        id: Number(r.id),
        dateLabel: formatLedgerDateLabel(createdAt),
        createdAt,
        typeLabel,
        amount: Number(r.fee_amount ?? 0),
        currency: (r.currency as string | null) || summary.currency,
        orderId: (r.order_id as string | null) ?? null,
        payoutBatchId: (r.payout_batch_id as string | null) ?? null,
        paymentReceiptNumber: (r.payment_receipt_number as string | null) ?? null,
        paidAt: paidAtRaw ? formatLedgerDateLabel(paidAtRaw) : "-",
        status,
      };
    });

    const data: EscrowDetailData = {
      summary,
      ledger,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in escrow detail API:', error);
    return NextResponse.json(
      { error: 'Failed to load escrow detail' },
      { status: 500 }
    );
  }
}

