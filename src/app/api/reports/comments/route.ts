// app/api/dashboard/coins/route.ts
import { NextResponse } from 'next/server';
import { CoinData, CoinTransaction } from '@/app/types/coins';
import { createClient } from '@supabase/supabase-js';
import { CommentReport } from '@/app/types/comments-report';
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
                comments:comment_id (
                id,
                content,
                likes,
                video_id),
                reporters:reporter_id (
                id,
                username
                )
            `)
        if (reportDataError) {
            console.error('Error fetching reports data:', reportDataError);
            throw new Error('Failed to fetch reports data');
        }
        const fullReportsData: CommentReport[] = await Promise.all(
            reportsData?.map(async (report: any) => {
                if (!report?.comments?.video_id) return report;
                const { data: videoData, error: videoError } = await supabase
                    .from('submissions')
                    .select('id, title, video_url')
                    .eq('id', report?.comments?.video_id)
                    .single();

                if (videoError) {
                    return report;
                }

                const { video_id, ...restComments } = report.comments;
                return {
                    ...report,
                    comments: {
                        ...restComments,
                        video: {
                            ...videoData
                        },
                    }
                };
            })
        );
        return NextResponse.json(fullReportsData);
    } catch (error) {
        console.error('Error fetching coin data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch coin data' },
            { status: 500 }
        );
    }
}
