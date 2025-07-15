"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ChallenzPagination from "@/components/ChallenzPagination";
import { CommentReport, Video } from "@/app/types/reports";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import VideoReportDialog from "@/app/report/components/video-report-dialog";
import { formatDate } from "@/helpers/formaters";
import { Pagination } from "@/app/types/pagination";


export default function CommentsTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [commentsData, setCommentsData] = useState<CommentReport[]>([]);
    const [video, setVideo] = useState<Video | null>(null);
    const itemsPerPage = 10;
    const [pagination, setPagination] = useState<Pagination>();
    const [page, setPage] = useState(1);
    const handleViewVideo = (video: Video | undefined) => {
        if (!video) return;
        setVideo(video);

    };
    const fetchComments = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: itemsPerPage.toString(),
            });
            const response = await fetch(`/api/reports/comments/?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch coin data');
            }
            const res = await response.json();

            setCommentsData(res?.data);
            setPagination(res?.pagination);
            setPage(res?.pagination?.currentPage || 1);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching comments data:', err);
        } finally {
            setIsLoading(false);
        }
    }, [page, itemsPerPage]);
    useEffect(() => {
        fetchComments();
    }, [page, fetchComments]);

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Comments</h2>
            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader className="bg-[#F7F9FC]">
                        <TableRow >
                            <TableHead className="w-[200px] text-center">USERNAME</TableHead>
                            <TableHead className="text-center bg-[#E4566466]">REASON REPORT</TableHead>
                            <TableHead className="text-center">COMMENT</TableHead>
                            <TableHead className="text-center">COMMENT LIKES</TableHead>
                            <TableHead className="text-center">CREATED AT</TableHead>
                            <TableHead className="text-center">VIDEO</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {commentsData?.map((report: CommentReport) => (
                            <TableRow key={report?.id}>
                                <TableCell className="font-medium text-center py-3">{report?.reporter?.username ? report?.reporter?.username : (<span className="text-gray-500">Not found</span>)}</TableCell>
                                <TableCell className="text-center  text-red-600">{report?.reason ? report?.reason : (<span className="text-gray-500">Not found</span>)}</TableCell>
                                <TableCell className="text-center">{report?.comment?.content ? report?.comment?.content : (<span className="text-gray-500">Not found</span>)}</TableCell>
                                <TableCell className="text-center">{report?.comment?.likes ? report?.comment?.likes : (<span className="text-gray-500">Not found</span>)}</TableCell>
                                <TableCell className="text-center">{report?.created_at ? formatDate(report?.created_at?.toString()) : (<span className="text-gray-500">Not found</span>)}</TableCell>
                                <TableCell className="text-center">
                                    {report?.comment?.video ? (
                                        <Button
                                            variant="ghost"
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => handleViewVideo(report.comment.video)}
                                        >
                                            View Video
                                        </Button>
                                    ) : (
                                        <span className="text-gray-500">No Video</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <ChallenzPagination currentPage={page} setCurrentPage={setPage} totalPages={pagination?.totalPages || 0} />

            {/* Video Player Modal */}
            <VideoReportDialog isOpen={!!video} onClose={() => setVideo(null)} video={video} />

        </div>
    );
}
