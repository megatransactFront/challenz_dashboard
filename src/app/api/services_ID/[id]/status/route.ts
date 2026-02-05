import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// TOGGLE STATUS — /api/services_ID/:id/status  body: { is_active: boolean }
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { is_active } = await req.json();
    if (typeof is_active !== 'boolean') {
      return NextResponse.json({ error: 'is_active must be boolean' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('services')
      .update({ is_active })
      .eq('id', id)
      .select('id,is_active')
      .single();

    if (error) throw error;
    return NextResponse.json({ service: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to update status' }, { status: 500 });
  }
}
