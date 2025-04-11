import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export async function GET() {
    try {
        const { data: reportsData, error: reportDataError } = await supabase
            .from('reports')
            .select(`
                id,
                title,
                description,
                created_at,
                video:video_id (
                id,
                title,
                video_url,
                description),
                reporter:user_id (
                id,
                username
                )
            `)
        if (reportDataError) {
            console.error('Error fetching reports data:', reportDataError);
            throw new Error('Failed to fetch reports data');
        }

        return NextResponse.json(reportsData);
    } catch (error) {
        console.error('Error fetching videos data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch videos data' },
            { status: 500 }
        );
    }
}
