import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await ctx.params; 

    const { data, error } = await supabase
      .from('return_requests')
      .select(`
        id,
        order_id,
        user_id,
        reason,
        status,
        created_at,
        items:return_request_items (
          id,
          quantity,
          order_item_id,
          order_item:order_items (
            id,
            product:products ( id, name, image_url )
          )
        ),
        photos:return_photos ( id, url )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const items = (data.items || []).map((it: any) => ({
      id: it.id,
      quantity: it.quantity,
      order_item_id: it.order_item_id,
      product: it.order_item?.product ?? null,
    }));

    return NextResponse.json({
      id: data.id,
      order_id: data.order_id,
      user_id: data.user_id,
      reason: data.reason,
      status: data.status,
      created_at: data.created_at,
      items,
      photos: data.photos || [],
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


export async function PUT(
  request: Request,
  ctx: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const nextStatus = body?.status as string;

    if (!['RETURN_REQUESTED', 'REFUNDED', 'NO_REFUND'].includes(nextStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('return_requests')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, status')
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ ok: true, ...data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
