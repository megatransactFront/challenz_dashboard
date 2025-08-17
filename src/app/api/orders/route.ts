import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const search = (searchParams.get('search') || '').trim().toLowerCase();

  try {
    if (type === 'summary') {
      const { data, error } = await supabase
        .from('orders')
        .select('status');

      if (error) {
        console.error('Summary fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
      }

      const totalOrders = data.length;
      let completedOrders = 0;
      let pendingOrders = 0;
      let cancelledOrders = 0;

      for (const row of data) {
        const s = String(row.status || '').toUpperCase();
        if (['DELIVERED', 'FULFILLED'].includes(s)) completedOrders++;
        else if (['PENDING_PAYMENT', 'AWAITING_FULFILLMENT', 'SHIPPED'].includes(s)) pendingOrders++;
        else if (['CANCELED', 'REFUNDED'].includes(s)) cancelledOrders++;
      }

      return NextResponse.json({ totalOrders, completedOrders, pendingOrders, cancelledOrders });
    }

    let query = supabase
      .from('orders')
      .select(`
        id,
        status,
        total_usd,
        uwc_held,
        created_at,
        order_items (
          id,
          quantity,
          product:products!order_items_product_id_fkey (
            name
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

    const filtered = search
      ? (data || []).filter((o) => String(o.id).toLowerCase().includes(search))
      : (data || []);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
