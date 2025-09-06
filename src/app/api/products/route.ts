// app/api/products/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const productId = searchParams.get('productId');
    const region = searchParams.get('region') || '';
    const q = searchParams.get('q') || '';
    const onlyLow = searchParams.get('onlyLow') === '1';
    const lowThreshold = parseInt(searchParams.get('lowThreshold') || '20', 10);
    const onlyActive = searchParams.get('onlyActive') === '1'; 
    
    // If productId is provided, return single product details
    if (productId) {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          id, name, description, type, price_usd, stock,
          uwc_discount_enabled, image_url, region, is_active, created_at
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;
      return NextResponse.json(product);
    }

    // Otherwise, return paginated products list
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let countQuery = supabase
      .from('products')
      .select('id', { count: 'exact', head: true });

    if (region) countQuery = countQuery.eq('region', region);
    if (q) countQuery = countQuery.ilike('name', `%${q}%`);
    if (onlyLow) countQuery = countQuery.or(`stock.lte.${lowThreshold},stock.is.null`);
    if (onlyActive) countQuery = countQuery.eq('is_active', true);

    const { count, error: countError } = await countQuery;
    if (countError) throw countError;

    let productsQuery = supabase
      .from('products')
      .select(`
        id, name, description, type, price_usd, stock,
        uwc_discount_enabled, image_url, region, is_active, created_at
      `)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (region) productsQuery = productsQuery.eq('region', region);
    if (q) productsQuery = productsQuery.ilike('name', `%${q}%`);
    if (onlyLow) productsQuery = productsQuery.or(`stock.lte.${lowThreshold},stock.is.null`);
    if (onlyActive) productsQuery = productsQuery.eq('is_active', true); 

    const { data: products, error: dataError } = await productsQuery;
    if (dataError) throw dataError;

    return NextResponse.json({
      products: products || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}







export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.description || !body.type) {
      return NextResponse.json(
        { error: "Name, description, and type are required." },
        { status: 400 }
      );
    }

    const insertData = {
      name: body.name,
      description: body.description,
      type: body.type,
      price_usd: parseFloat(body.price_usd) || 0,
      stock: parseInt(body.stock) || 0,
      image_url: body.image_url || null,
      uwc_discount_enabled: !!body.uwc_discount_enabled,
      is_active: body.is_active !== undefined ? !!body.is_active : true,
      region: body.region || null,
    };

    const { data, error } = await supabase
      .from('products')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
