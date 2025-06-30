// app/api/subscriptions/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);









//GET: list or fetch by userId....
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId');

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    if (userId) {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return NextResponse.json(data);
    }

    const { count, error: countError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    const { data, error: dataError } = await supabase
      .from('subscriptions')
      .select('*')
      .range(from, to)
      .order('start_date', { ascending: false });

    if (dataError) throw dataError;

    return NextResponse.json({
      subscriptions: data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}









//POST: create a new subscription...
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      user_id,
      plan_id,
      uwc_redeemed,
      amount_paid,
      start_date,
      end_date,
      status
    } = body;

    const { data, error } = await supabase.from('subscriptions').insert([
      {
        user_id,
        plan_id,
        uwc_redeemed,
        amount_paid,
        start_date,
        end_date,
        status
      }
    ]);

    if (error) throw error;

    return NextResponse.json({
      message: 'Subscription created successfully',
      data
    });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}









//PATCH: update subscription(e.g., cancel, change status)..
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, end_date } = body;

    if (!id) return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });

    const { data, error } = await supabase
      .from('subscriptions')
      .update({ status, end_date })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'Subscription updated', data });
  } catch (error) {
    console.error('PATCH Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}









//DELETE: delete subscription(if needed)..
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });

    const { data, error } = await supabase.from('subscriptions').delete().eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'Subscription deleted', data });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
