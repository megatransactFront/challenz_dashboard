// app/api/products/bulk-stock/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { updates } = (await request.json()) as {
      updates: { id: string; stock: number }[];
    };

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    for (const u of updates) {
      const safeStock = Math.max(0, Number(u.stock || 0));
      const { error } = await supabase
        .from('products')
        .update({ stock: safeStock })
        .eq('id', u.id);

      if (error) {
        return NextResponse.json(
          { error: `Failed updating ${u.id}: ${error.message}` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('bulk-stock error:', e);
    return NextResponse.json(
      { error: e?.message ?? 'Bulk update failed' },
      { status: 500 }
    );
  }
}
