import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
type OrderRef = {
  id: string;
  status: string;
  shipping_address: string | null;
  region: string | null;
};

type ProductRef = {
  id: string;
  name: string;
  image_url: string | null;
};

type OrderItemWithRefs = {
  id: string;
  order_id: string;
  quantity: number;
  region: string;
  created_at: string;
  order: OrderRef | null;
  product: ProductRef | null;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });

  const { data, error } = await supabase
    .from('order_items')
    .select(`
      id,
      order_id,
      quantity,
      region,
      created_at,
      order:order_id (
        id,
        status,
        shipping_address,
        region
      ),
      product:product_id (
        id,
        name,
        image_url
      )
    `)
    .eq('id', id)
    .maybeSingle() as { data: OrderItemWithRefs | null; error: any }; 

  if (error || !data) {
    console.error('Fetch error:', error?.message);
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  const payload = {
    id: data.id,
    quantity: data.quantity,
    created_at: data.created_at,
    region: data.region,
    productName: data.product?.name ?? 'Unnamed Product', 
    order: data.order
      ? {
          id: data.order.id,
          status: data.order.status,
          shipping_address: data.order.shipping_address,
          region: data.order.region,
        }
      : null,
  };

  return NextResponse.json(payload);
}


export async function PUT(request: NextRequest) {
  const { itemId, status } = await request.json();

  if (!itemId || !status) {
    return NextResponse.json({ error: 'itemId and status are required' }, { status: 400 });
  }


  const { data: item, error: itemErr } = await supabase
    .from('order_items')
    .select('order_id')
    .eq('id', itemId)
    .maybeSingle();

  if (itemErr || !item?.order_id) {
    console.error('Item lookup failed:', itemErr?.message);
    return NextResponse.json({ error: 'Order item not found' }, { status: 404 });
  }

  const { error: updErr } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', item.order_id);

  if (updErr) {
    console.error('Order status update failed:', updErr.message);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Order status updated' });
}
