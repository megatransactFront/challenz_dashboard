// app/api/challenz/[id]/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define the params type for Next.js 14
type RouteParams = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;

    // Fetch the challenge details
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select(`
        *,
        user:user_id (
          id,
          first_name,
          last_name,
          profile_picture_url
        ),
        creator:creator_id (
          id,
          first_name,
          last_name
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