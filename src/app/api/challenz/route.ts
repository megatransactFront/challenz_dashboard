// app/api/challenz/route.ts
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
    const { count, error: countError } = await supabase
      .from('challenges')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count Error:', countError);
      throw countError;
    }

    // Get paginated data
    const { data: challenges, error: dataError } = await supabase
      .from('challenges')
      .select(`
        id,
        creator_id,
        title,
        description,
        category,
        is_seasonal,
        is_sponsored,
        created_at,
        updated_at,
        user_id,
        video_url
      `)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (dataError) {
      console.error('Data Error:', dataError);
      throw dataError;
    }

    // Add mock metrics
    const transformedChallenges = challenges?.map(challenge => ({
      ...challenge,
      views: Math.floor(Math.random() * 10000),
      usersJoined: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 100)
    }));

    console.log('Full Supabase Response:', {
      data: challenges,
    });

    return NextResponse.json({
      challenges: transformedChallenges || [],
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
      { 
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error : undefined 
      },
      { status: 500 }
    );
  }
}