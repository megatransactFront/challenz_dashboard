
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ALLOWED_STATUSES = new Set([
  'PENDING_PAYMENT',
  'AWAITING_FULFILLMENT',
  'FULFILLED',
  'SHIPPED',
  'DELIVERED',
  'PAYMENT_FAILED',
  'CANCELED',
  'RETURN_REQUESTED',
  'REFUNDED',
  'NO_REFUND',
]);

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;
  if (!orderId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      region,
      shipping_address,
      created_at,
      total_usd,
      uwc_held,
      order_items (
        id,
        quantity,
        region,
        created_at,
        product:product_id (
          id,
          name,
          image_url
        )
      )
    `)
    .eq('id', orderId)
    .maybeSingle();

  if (error || !data) {
    console.error('Order fetch error:', error?.message);
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;
  const body = await req.json().catch(() => ({}));
  const { status } = body || {};

  if (!orderId || !status) {
    return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
  }
  if (!ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    console.error('Order status update failed:', error.message);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Order status updated' });
}
