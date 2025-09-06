import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'RETURN_REQUESTED' | 'REFUNDED' | 'NO_REFUND'
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let q = supabase
      .from('return_requests')
      .select(`
        id,
        order_id,
        user_id,
        reason,
        status,
        created_at,
        items:return_request_items ( id ),
        photos:return_photos ( id )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) q = q.eq('status', status);
    if (startDate) q = q.gte('created_at', startDate);
    if (endDate) q = q.lte('created_at', `${endDate}T23:59:59.999Z`);
    if (search) {
      q = q.or(
        `id.ilike.%${search}%,order_id.ilike.%${search}%,reason.ilike.%${search}%`
      );
    }

    const { data, error } = await q;
    if (error) throw error;

    const returns = (data || []).map((r: any) => ({
      id: r.id,
      order_id: r.order_id,
      user_id: r.user_id,
      reason: r.reason,
      status: r.status,
      created_at: r.created_at,
      item_count: r.items?.length ?? 0,
      photo_count: r.photos?.length ?? 0,
    }));

    return NextResponse.json({ returns });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
