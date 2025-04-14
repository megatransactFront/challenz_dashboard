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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Video, VideoReport } from "@/app/types/reports";
import { Button } from "@/components/ui/button";
import VideoReportDialog from "./video-report-dialog";
import { formatDate } from "@/helpers/formater";

export default function VideosTab() {
    const itemsPerPage = 10;
    const [currentItems, setCurrentItems] = useState<VideoReport[] | []>([]);
    const handleSetCurrentItems = useCallback((items: VideoReport[]) => {
        setCurrentItems(items);
    }, []);
    const [isLoading, setIsLoading] = useState(false);
    const [video, setVideo] = useState<Video | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [videosData, setVideosData] = useState<VideoReport[]>([]);
    const fetchVideos = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/reports/videos');

            if (!response.ok) {
                throw new Error('Failed to fetch videos data');
            }
            const data = await response.json();
            setVideosData(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching videos data:', err);
        } finally {
            setIsLoading(false);
        }
    };
    const handleViewVideo = (video: Video | undefined) => {
        if (!video) return;
        setVideo(video);

    };
    useEffect(() => {
        fetchVideos();
        setCurrentItems(videosData.slice(0, itemsPerPage));
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
            <h2 className="text-2xl font-semibold">Videos</h2>
            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#F7F9FC]">
                            <TableHead className="w-[200px] text-center">CREATOR</TableHead>
                            <TableHead className="text-center">TITLE</TableHead>
                            <TableHead className="text-center">DESCRIPTION</TableHead>
                            <TableHead className="text-center">CREATED AT</TableHead>
                            <TableHead className="text-center">VIDEO</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map((report: VideoReport) => (
                            <TableRow key={report?.id}>
                                <TableCell className="font-medium py-3 text-center">{report?.reporter?.username ? report?.reporter?.username : (<span className="text-gray-500">Not found</span>)}</TableCell>
                                <TableCell className="text-center">{report?.title ? report?.title : (<span className="text-gray-500">Not found</span>)}</TableCell>
                                <TableCell className="text-center">{report?.description ? report?.description : (<span className="text-gray-500">Not found</span>)}</TableCell>
                                <TableCell className="text-center">{report?.created_at ? formatDate(report?.created_at) : (<span className="text-gray-500">Not found</span>)}</TableCell>
                                <TableCell className="text-center">
                                    {report?.video ? (
                                        <Button
                                            variant="ghost"
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => handleViewVideo(report?.video)}
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

            <ChallenzPagination items={videosData} itemsPerPage={itemsPerPage} setCurrentItems={handleSetCurrentItems} />
            <VideoReportDialog isOpen={!!video} onClose={() => setVideo(null)} video={video} />
        </div>
    );
}
