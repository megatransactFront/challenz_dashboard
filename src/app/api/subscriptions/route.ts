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
    const userId = searchParams.get('userId');

    const query = supabase
      .from('subscriptions')
      .select(`
        subscriptionid,
        userid,
        planid,
        status,
        start_date,
        end_date,
        auto_renew,
        payment_method,
        created_at,
        users (
          id,
          username
        ),
        plans (
          planid,
          name,
          services (
            serviceid,
            name
          )
        )
      `)
      .order('start_date', { ascending: false });

    if (userId) {
      query.eq('userid', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
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
      subscriptionid,
      userid,
      planid,
      status,
      start_date,
      end_date,
      auto_renew,
      payment_method
    } = body;

    if (!subscriptionid || !userid || !planid) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase.from('subscriptions').insert([
      {
        subscriptionid,
        userid,
        planid,
        status: status?.toUpperCase(),
        start_date,
        end_date,
        auto_renew: auto_renew ?? true,
        payment_method
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
    const {
      subscriptionid,
      planid,
      status,
      start_date,
      end_date,
      auto_renew,
      payment_method
    } = body;

    if (!subscriptionid) {
      return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
    }

    const updateData: any = {
      ...(planid !== undefined && { planid }),
      ...(status !== undefined && { status: status.toUpperCase() }),
      ...(start_date !== undefined && { start_date }),
      ...(end_date !== undefined && { end_date }),
      ...(auto_renew !== undefined && { auto_renew }),
      ...(payment_method !== undefined && { payment_method }),
    };

    const { data, error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('subscriptionid', subscriptionid);

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
    const subscriptionid = searchParams.get('id');

    if (!subscriptionid) {
      return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('subscriptionid', subscriptionid);

    if (error) throw error;
    return NextResponse.json({ message: 'Subscription deleted', data });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
