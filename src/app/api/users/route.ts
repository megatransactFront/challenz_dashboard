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
    const userId = searchParams.get('userId');

    // If userId is provided, return single user details
    if (userId) {
      const { data: user, error } = await supabase
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
          referral_code,
          challenges:challenges!creator_id (
            id,
            title,
            created_at
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return NextResponse.json(user);
    }

    // Otherwise, return paginated users list
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get total count
    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // Get paginated users
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

    if (dataError) throw dataError;

    return NextResponse.json({
      users: users || [],
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