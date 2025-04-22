import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    try {
        const { data: reportsData, error: reportDataError, count } = await supabase
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
            `, { count: "exact" }).range(from, to)
            .order('created_at', { ascending: false });
        if (reportDataError) {
            console.error('Error fetching reports data:', reportDataError);
            throw new Error('Failed to fetch reports data');
        }

        return NextResponse.json({
            data: reportsData,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil((count || 0) / limit),
                totalItems: count || 0,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        console.error('Error fetching videos data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch videos data' },
            { status: 500 }
        );
    }
}
