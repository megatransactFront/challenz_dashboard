// app/api/challenz/[id]/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Fetch the challenge details
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select(`
        *,
        user:user_id (
          id,
          name,
          avatar_url
        ),
        creator:creator_id (
          id,
          name,
          profile_details
        )
      `)
      .eq('id', id)
      .single();

    if (challengeError) throw challengeError;

    return NextResponse.json(challenge);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}