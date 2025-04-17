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

    const { data: challenges, count, error } = await supabase
      .from('submissions')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const userIds = [...new Set(challenges.map(c => c.user_id))];

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username, first_name, last_name, profile_picture_url')
      .in('id', userIds);

    if (usersError) throw usersError;

    const userMap = Object.fromEntries(users.map(user => [user.id, user]));

    const transformedChallenges = challenges.map(challenge => ({
      ...challenge,
      creator: userMap[challenge.user_id],
      views: Math.floor(Math.random() * 10000),
      usersJoined: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 100)
    }));

    return NextResponse.json({
      challenges: transformedChallenges,
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