// app/api/challenz/[challengeId]/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { challengeId: string } }
) {
  try {
    const { data: challenge, error } = await supabase
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
        video_url,
        duet_video_url,
        submission_id,
        joined_at,
        inspired_by_id,
        creator:users!creator_id (
          id,
          username,
          first_name,
          last_name,
          profile_picture_url
        )
      `)
      .eq('id', params.challengeId)
      .single();

    if (error) throw error;

    // Add mock metrics for consistency
    const transformedChallenge = {
      ...challenge,
      views: Math.floor(Math.random() * 10000),
      usersJoined: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 100)
    };

    return NextResponse.json(transformedChallenge);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}