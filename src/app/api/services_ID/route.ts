// src/app/api/services/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');

    let query = supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (region) query = query.eq('region', region);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/services error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const requiredFields = ['id', 'name', 'region', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    const insertData = {
      id: body.id,
      name: body.name,
      region: body.region,
      description: body.description,
      standardPrice: parseFloat(body.standardPrice) || null,
      discountedPrice: parseFloat(body.discountedPrice) || null,
      duration_months: parseInt(body.duration_months) || null,
      uwaciCoinsRequired: parseFloat(body.uwaciCoinsRequired) || null,
      cancellationPolicy: body.cancellationPolicy || null,
      minimum_term: parseInt(body.minimum_term) || null,
    };

    const { data, error } = await supabase
      .from('services')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('POST /api/services error:', err);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
