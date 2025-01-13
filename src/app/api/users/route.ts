// app/api/users/route.ts
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

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get total count
    const countResult = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    console.log('\n=== Count Query Result ===');
    console.log(JSON.stringify(countResult, null, 2));

    if (countResult.error) throw countResult.error;

    // Get user data with correct columns
    const { data: users, error: dataError } = await supabase
      .from('users')
      .select(`
        id,
        username,
        email,
        first_name,
        last_name,
        phone_number,
        birthday,
        parent_id,
        coins,
        total_coins_earned,
        role,
        is_locked,
        created_at,
        updated_at,
        age,
        profile_picture_url,
        bio,
        location,
        isabove18,
        acceptterms,
        referral_code
      `)
      .range(from, to)
      .order('created_at', { ascending: false });

    console.log('\n=== Main Query Result ===');
    console.log(JSON.stringify(users, null, 2));

    if (dataError) throw dataError;

    return NextResponse.json({
      users: users || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((countResult.count || 0) / limit),
        totalItems: countResult.count || 0,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('\n=== API Error ===');
    console.error(error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error : undefined 
      },
      { status: 500 }
    );
  }
}