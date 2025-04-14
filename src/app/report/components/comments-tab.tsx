"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import { formatDate } from "@/app/helpers/formater";
let cachedComments: CommentReport[] | null = null;

export default function CommentsTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [commentsData, setCommentsData] = useState<CommentReport[]>([]);
    const [video, setVideo] = useState<Video | null>(null);
    const [currentItems, setCurrentItems] = useState<CommentReport[]>([]);
    const itemsPerPage = 10;

    const handleSetCurrentItems = useCallback((items: CommentReport[]) => {
        setCurrentItems(items);
    }, []);

    const handleViewVideo = (video: Video | undefined) => {
        if (!video) return;
        setVideo(video);
    };

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            if (cachedComments) {
                setCommentsData(cachedComments);
                setCurrentItems(cachedComments.slice(0, itemsPerPage));
                setIsLoading(false);
                return;
            }
            const response = await fetch('/api/reports/comments');
            if (!response.ok) throw new Error('Failed to fetch comment data');

            const data = await response.json();
            cachedComments = data; // cache in memory
            setCommentsData(data);
            setCurrentItems(data.slice(0, itemsPerPage));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

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
                        {currentItems?.map((report: CommentReport) => (
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
            <ChallenzPagination items={commentsData} itemsPerPage={itemsPerPage} setCurrentItems={handleSetCurrentItems} />

            {/* Video Player Modal */}
            <VideoReportDialog isOpen={!!video} onClose={() => setVideo(null)} video={video} />

        </div>
    );
}
