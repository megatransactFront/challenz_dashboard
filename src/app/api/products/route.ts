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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const productId = searchParams.get('productId');

    // If productId is provided, return single product details
    if (productId) {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          type,
          price_usd,
          stock,
          uwc_discount_enabled,
          image_url,
          is_active,
          created_at
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;
      return NextResponse.json(product);
    }

    // Otherwise, return paginated products list
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get total count
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // Get paginated products
    const { data: products, error: dataError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        type,
        price_usd,
        stock,
        uwc_discount_enabled,
        image_url,
        is_active,
        created_at
      `)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (dataError) throw dataError;

    return NextResponse.json({
      products: products || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}





export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic server-side validation
    if (!body.name || !body.description || !body.type) {
      return NextResponse.json(
        { error: "Name, description, and type are required." },
        { status: 400 }
      );
    }

    // You can expand this validation as needed
    const insertData = {
      name: body.name,
      description: body.description,
      type: body.type,
      price_usd: parseFloat(body.price_usd) || 0,
      stock: parseInt(body.stock) || 0,
      image_url: body.image_url || null,
      uwc_discount_enabled: !!body.uwc_discount_enabled,
      is_active: body.is_active !== undefined ? !!body.is_active : true,
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
