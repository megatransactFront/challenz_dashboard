// app/api/dashboard/coins/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export async function GET() {
    try {
        const { data: reportsData, error: reportDataError } = await supabase
            .from('comment_reports')
            .select(`
                id,
                reason,
                created_at,
                comment:comment_id (
                id,
                content,
                likes,
                video_id),
                reporter:reporter_id (
                id,
                username
                )
            `)
        if (reportDataError) {
            console.error('Error fetching reports data:', reportDataError);
            throw new Error('Failed to fetch reports data');
        }
        const fullReportsData = await Promise.all(
            reportsData?.map(async (report: any) => {
                if (!report?.comment?.video_id) return report;
                const { data: videoData, error: videoError } = await supabase
                    .from('submissions')
                    .select('id, title, video_url, description')
                    .eq('id', report?.comment?.video_id)
                    .single();

                if (videoError || !videoData) {
                    return report;
                }

                return {
                    ...report,
                    comment: {
                        id: report?.comment?.id,
                        content: report?.comment?.content,
                        likes: report?.comment?.likes,
                        video: {
                            ...videoData
                        },
                    }
                };
            })
        );
        return NextResponse.json(fullReportsData);
    } catch (error) {
        console.error('Error fetching comments data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch comments data' },
            { status: 500 }
        );
    }
}
