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
  const username = searchParams.get('username');

  try {
    if (type === 'summary') {
      const { data: allOrderItems, error } = await supabase
        .from('orderitems')
        .select('status');

      if (error) {
        console.error('Summary fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch order items' }, { status: 500 });
      }

      const totalOrders = allOrderItems.length;
      let completedOrders = 0;
      let pendingOrders = 0;
      let cancelledOrders = 0;

      for (const item of allOrderItems) {
        const s = item.status?.toUpperCase();
        if (['DELIVERED', 'NO_REFUND'].includes(s)) completedOrders++;
        else if (['PENDING_PAYMENT', 'AWAITING_FULFILLMENT', 'FULFILLED', 'SHIPPED'].includes(s)) pendingOrders++;
        else if (['CANCELED', 'PAYMENT_FAILED', 'REFUNDED'].includes(s)) cancelledOrders++;
      }

      return NextResponse.json({ totalOrders, completedOrders, pendingOrders, cancelledOrders });
    }

    let query = supabase
      .from('orders')
      .select(`
        orderid,
        total_price,
        total_uwc_used,
        created_at,
        users:userid (
          username
        ),
        orderitems (
          id,
          status,
          quantity,
          products:productid (
            name
          )
        )
      `);

    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Orders fetch error:', error.message);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    const filteredData = data.filter(order => {
      const matchUser = !username || (
        Array.isArray(order.users) &&
        order.users[0]?.username?.toLowerCase().replace(/\s+/g, '') === username.toLowerCase()
      );

      const matchStatus = !status || status === 'Any' || order.orderitems?.some(
        (item) => item.status?.toUpperCase() === status.toUpperCase()
      );

      return matchUser && matchStatus;
    });

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
