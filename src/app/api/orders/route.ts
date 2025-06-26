import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  const search = searchParams.get('search') || '';
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    if (type === 'summary') {
      const { data: allOrders, error } = await supabase
        .from('orders')
        .select('status');

      if (error) {
        console.error('Summary fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
      }

      const totalOrders = allOrders.length;
      let completedOrders = 0;
      let pendingOrders = 0;
      let cancelledOrders = 0;

      for (const order of allOrders) {
        const status = order.status?.toUpperCase();
        if (['DELIVERED', 'NO'].includes(status)) {
          completedOrders++;
        } else if (['PENDING_PAYMENT', 'AWAITING_FULFILLMENT', 'FULFILLED', 'SHIPPED'].includes(status)) {
          pendingOrders++;
        } else if (['CANCELED', 'PAYMENT_FAILED', 'REFUNDED'].includes(status)) {
          cancelledOrders++;
        }
      }

      return NextResponse.json({
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
      });
    }

    let query = supabase.from('orders').select('*');

    if (search) query = query.ilike('customer', `%${search}%`);
    if (status && status !== 'Any') query = query.eq('status', status);
    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);
    if (searchParams.has('id')) {
        const id = searchParams.get('id');
        const { data, error } = await supabase.from('orders').select('*').eq('id', id);
        
        if (error) {
            console.error('Fetch by ID failed:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(data);
    }

    query = query.order('date', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Orders fetch error:', error.message);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
    const { id, updates } = await req.json();

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing order ID' }, { status: 400 });
    }

    const allowedKeys = ['status', 'shipmentProvider', 'trackingNumber', 'expectedDelivery', 'returnDecision', 'returnReason'];
    const sanitizedUpdates: Record<string, any> = {};

    for (const key of allowedKeys) {
      if (updates.hasOwnProperty(key)) {
        sanitizedUpdates[key] = updates[key];
      }
    }

    const { error } = await supabase
      .from('orders')
      .update(sanitizedUpdates)
      .eq('id', id);

    if (error) {
      console.error('Supabase update error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Order updated successfully' });
  } catch (err) {
    console.error('PUT error:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
