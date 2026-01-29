// app/api/subscriptions/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const query = supabase
      .from('subscriptions')
      .select(`
        id,
        user_id,
        service_id,
        status,
        start_date,
        renewal_date,
        uwc_held,
        price_usd,
        created_at,
        updated_at,
        services (
          id,
          name,
          image_url
        )
      `)
      .order('start_date', { ascending: false });

    if (userId) {
      query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /subscriptions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      user_id,
      service_id = null,
      status = 'ACTIVE',
      start_date,         
      renewal_date,        
      uwc_held = 0,
      price_usd
    } = body ?? {};

    if (!user_id || price_usd == null) {
      return NextResponse.json({ error: 'Missing required fields: user_id, price_usd' }, { status: 400 });
    }

    const now = new Date();
    const start = start_date ?? now.toISOString().slice(0, 10);
    const renew = renewal_date ?? (() => {
      const d = new Date(now);
      d.setMonth(d.getMonth() + 1);
      if (d.getDate() !== now.getDate()) d.setDate(0);
      return d.toISOString().slice(0, 10);
    })();

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id,
          service_id,
          status,
          start_date: start,
          renewal_date: renew,
          uwc_held,
          price_usd: Number(price_usd),
        },
      ])
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Subscription created', data });
  } catch (error) {
    console.error('POST /subscriptions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id,                 
      status,
      start_date,
      renewal_date,
      uwc_held,
      price_usd,
      service_id,
    } = body ?? {};

    if (!id) {
      return NextResponse.json({ error: 'Missing subscription id' }, { status: 400 });
    }

    const update: Record<string, any> = {};
    if (status !== undefined) update.status = status;
    if (start_date !== undefined) update.start_date = start_date;
    if (renewal_date !== undefined) update.renewal_date = renewal_date;
    if (uwc_held !== undefined) update.uwc_held = uwc_held;
    if (price_usd !== undefined) update.price_usd = Number(price_usd);
    if (service_id !== undefined) update.service_id = service_id;

    const { data, error } = await supabase
      .from('subscriptions')
      .update(update)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Subscription updated', data });
  } catch (error) {
    console.error('PATCH /subscriptions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing subscription id' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Subscription deleted', data });
  } catch (error) {
    console.error('DELETE /subscriptions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
