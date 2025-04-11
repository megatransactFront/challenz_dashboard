"use client";

import React, { use, useCallback, useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ChallenzPagination from "@/components/ChallenzPagination";
import { CommentReport } from "@/app/types/comments-report";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import VideoCommentsTab from "@/app/report/components/video-comments-tab";

interface Video {
    id: string
    title: string
    video_url: string
}

export default function CommentsTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [commentsData, setCommentsData] = useState<CommentReport[]>([]);
    const [video, setVideo] = useState<Video | null>(null);
    const itemsPerPage = 10;
    const [currentItems, setCurrentItems] = useState<CommentReport[]>([]);
    const handleSetCurrentItems = useCallback((items: CommentReport[]) => {
        setCurrentItems(items);
    }, []);
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const handleViewVideo = (video: Video | undefined) => {
        console.log(video);

        if (!video) return;
        setVideo(video);

    };
    const fetchComments = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/reports/comments');

            if (!response.ok) {
                throw new Error('Failed to fetch coin data');
            }

            const data = await response.json();

            setCommentsData(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching comments data:', err);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchComments();
        setCurrentItems(commentsData.slice(0, itemsPerPage));
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
                    <TableHeader className="bg-[#F7F9FC] ">
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
                        {currentItems?.map((report) => (
                            <TableRow key={report?.id}>
                                <TableCell className="font-medium text-center py-3">{report?.reporters?.username}</TableCell>
                                <TableCell className="text-center  text-red-600">{report?.reason}</TableCell>
                                <TableCell className="text-center">{report?.comments?.content}</TableCell>
                                <TableCell className="text-center">{report?.comments?.likes}</TableCell>
                                <TableCell className="text-center">{formatDate(report?.created_at?.toString())}</TableCell>
                                <TableCell className="text-center">
                                    {report?.comments?.video ? (
                                        <Button
                                            variant="ghost"
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => handleViewVideo(report?.comments?.video)}
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
            <VideoCommentsTab isOpen={!!video} onClose={() => setVideo(null)} video={video} />

        </div>
    );
}
