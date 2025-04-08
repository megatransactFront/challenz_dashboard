// app/api/challenz/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { json } from 'stream/consumers';
import { log } from 'util';

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
      .from('submissions')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    const { data: challenges, error: challengesError } = await supabase
      .from('user_challenges')
      .select('*, submissions(*)')

    if (challengesError) {
      console.error('Error fetching challenges:', challengesError);
      throw challengesError;
    }

    const usersChallenges = await Promise.all(
      challenges.map(async (challenge) => {
        const { data: creator, error: userError } = await supabase
          .from('users')
          .select('id, username, first_name, last_name, profile_picture_url')
          .eq('id', challenge?.submissions.user_id)
          .single();

        if (userError) {
          console.error('Error fetching user:', userError);
          throw userError;
        }
        return {
          creator,
          ...challenge?.submissions
        };
      })
    );

    // Transform data with mock metrics
    const transformedChallenges = usersChallenges?.map(challenge => ({
      ...challenge,
      views: Math.floor(Math.random() * 10000),
      usersJoined: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 100)
    }));

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