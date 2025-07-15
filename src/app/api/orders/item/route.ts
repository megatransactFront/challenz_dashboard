import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('orderitems')
    .select(`
      id,
      status,
      shipmentProvider,
      trackingNumber,
      expectedDelivery,
      returnDecision,
      returnReason,
      products:productid (
        name
      )
    `)
  .eq('id', id)
  .limit(1);


  if (error || !data) {
    console.error('Fetch error:', error?.message);
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

 return NextResponse.json(data[0]);
}









export async function PUT(request: NextRequest) {
  const { items } = await request.json();

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items to update' }, { status: 400 });
  }

  const updates = await Promise.all(
    items.map(async (item) => {
      const { error } = await supabase
        .from('orderitems')
        .update({
          status: item.status,
          shipmentProvider: item.shipmentProvider || null,
          trackingNumber: item.trackingNumber || null,
          expectedDelivery: item.expectedDelivery || null,
          returnReason: item.returnReason || null,
          returnDecision: item.returnDecision || null,
        })
        .eq('id', item.id)
        .select('id');

      if (error) {
        console.error(`Failed to update item ${item.id}:`, error.message);
        return { id: item.id, success: false, error: error.message };
      }

      return { id: item.id, success: true };
    })
  );

  const failed = updates.filter((u) => !u.success);
  if (failed.length > 0) {
    return NextResponse.json({ message: 'Some items failed to update', failed }, { status: 207 });
  }

  return NextResponse.json({ message: 'All items updated successfully' });
}

