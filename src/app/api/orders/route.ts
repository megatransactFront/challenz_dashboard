import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const asISO = (s: string | null) => (s ? new Date(s).toISOString() : null);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const startDate = asISO(searchParams.get('startDate'));
  const endDate = asISO(searchParams.get('endDate'));
  const search = (searchParams.get('search') || '').trim().toLowerCase();

  try {
    if (type === 'summary') {
      const { data, error } = await supabase
        .from('orders')
        .select('status,total_usd,uwc_held');

      if (error) {
        console.error('Summary fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
      }

      const totalOrders = data.length;
      let completedOrders = 0;
      let pendingOrders = 0;
      let cancelledOrders = 0;
      let revenueUsd = 0;
      let uwcCoins = 0;

      for (const row of data) {
        const s = String(row.status || '').toUpperCase();
        if (['DELIVERED', 'FULFILLED'].includes(s)) completedOrders++;
        else if (['PENDING_PAYMENT', 'AWAITING_FULFILLMENT', 'SHIPPED'].includes(s)) pendingOrders++;
        else if (['CANCELED', 'REFUNDED'].includes(s)) cancelledOrders++;

        revenueUsd += Number(row.total_usd ?? 0);
        uwcCoins += Number(row.uwc_held ?? 0);
      }

      return NextResponse.json({
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        revenueUsd: Number(revenueUsd.toFixed(2)),
        uwcCoins,
      });
    }

    let query = supabase
      .from('orders')
      .select(`
        id,
        status,
        region,                 
        shipping_address,       
        total_usd,
        uwc_held,
        created_at,
        order_items (
          id,
          quantity,
          unit_price_usd,
          discounted_price_usd,
          uwc_required,
          product:product_id (
            name,
            image_url,
            price_usd
          )
        )
      `);

    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);
    if (status && status !== 'Any') query = query.eq('status', status);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error('Orders fetch error:', error.message);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    const filtered = (data || []).filter((o) => {
      if (!search) return true;
      const idMatch = String(o.id).toLowerCase().includes(search);
      const productMatch = (o.order_items || [])
        .some((it: any) => String(it?.product?.name || '').toLowerCase().includes(search));
      return idMatch || productMatch;
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
