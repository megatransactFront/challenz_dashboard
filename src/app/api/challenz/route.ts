// app/api/challenz/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search')?.toLowerCase();

    // Calculate range for pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // First, get the total count
    const { count, error: countError } = await supabase
      .from('challenges')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count Error:', countError);
      throw countError;
    }

    // Then get the paginated data
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

    // Transform the data to include mock views for now
    const transformedChallenges = challenges?.map(challenge => ({
      ...challenge,
      views: Math.floor(Math.random() * 10000), // Mock views for now
      usersJoined: Math.floor(Math.random() * 1000), // Mock users joined
      likes: Math.floor(Math.random() * 500), // Mock likes
      comments: Math.floor(Math.random() * 100) // Mock comments
    }));


    // Detailed logging
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