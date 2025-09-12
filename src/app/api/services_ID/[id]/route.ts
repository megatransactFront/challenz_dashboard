import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// READ ONE — /api/services_ID/:id
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('services')
    .select(`
      id,
      name,
      description,
      region,
      standardPrice,
      discountedPrice,
      duration_months,
      uwaciCoinsRequired,
      cancellationPolicy,
      minimum_term,
      is_active,
      created_at
    `)
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }
  return NextResponse.json({ service: data });
}

// UPDATE — /api/services_ID/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    const toNum = (v: any, fallback = 0) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : fallback;
    };
    const toNullableNum = (v: any) =>
      v === '' || v === null || v === undefined
        ? null
        : Number.isFinite(Number(v))
        ? Number(v)
        : null;

    const updateData: any = {
      name: body.name,
      description: body.description,
      region: body.region ?? null,
      standardPrice: body.standardPrice !== undefined ? toNum(body.standardPrice, 0) : undefined,
      discountedPrice: body.discountedPrice !== undefined ? toNullableNum(body.discountedPrice) : undefined,
      duration_months: body.duration_months !== undefined ? toNum(body.duration_months, 0) : undefined,
      uwaciCoinsRequired: body.uwaciCoinsRequired !== undefined ? toNum(body.uwaciCoinsRequired, 0) : undefined,
      cancellationPolicy: body.cancellationPolicy ?? undefined,
      minimum_term: body.minimum_term !== undefined ? toNum(body.minimum_term, 0) : undefined,
      is_active: typeof body.is_active === 'boolean' ? body.is_active : undefined,
    };

    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ service: data });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 400 });
  }
}

// DELETE — /api/services_ID/:id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('services').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
