import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
     name,
     description,
     start_time,
     end_time,
     created_at
    } = body;

    if (!name || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase.from('flashsales').insert([
      {
     name,
     description,
     start_time,
     end_time,
     created_at
      }
    ]);

    if (error) throw error;

    return NextResponse.json({
      message: 'Flash Sale created successfully',
      data
    });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}





