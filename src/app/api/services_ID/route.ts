// src/app/api/services_ID/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const region = searchParams.get('region');

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Count
    let countQuery = supabase
      .from('services')
      .select('*', { count: 'exact', head: true });
    if (region) countQuery = countQuery.eq('region', region);
    const { count } = await countQuery;

    // Data
    let dataQuery = supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (region) dataQuery = dataQuery.eq('region', region);

    const { data, error } = await dataQuery;
    if (error) throw error;

    return NextResponse.json({
      services: data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit,
      }
    });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newService = {
      serviceId: body.serviceId,
      region: body.region,
      name: body.name,
      description: body.description,
      standardPrice: parseFloat(body.standardPrice),
      discountedPrice: parseFloat(body.discountedPrice),
      duration_months: parseInt(body.duration_months),
      uwaciCoinsRequired: parseInt(body.uwaciCoinsRequired),
      cancellationPolicy: body.cancellationPolicy,
      minimum_term: parseInt(body.minimum_term),
    };

    const { data, error } = await supabase
      .from('services')
      .insert([newService])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
