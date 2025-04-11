"use client";

import React, { useCallback, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ChallenzPagination from "@/components/ChallenzPagination";

interface Video {
    id: number;
    username: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
}

const videosData: Video[] = [
    {
        id: 1,
        username: "DanceKing",
        title: "Ultimate Dance Tutorial - Learn in 5 Minutes",
        views: 125000,
        likes: 8700,
        comments: 342,
        shares: 1200,
    },
    {
        id: 2,
        username: "FitnessFanatic",
        title: "Morning Workout Routine - Get Energized!",
        views: 89500,
        likes: 6200,
        comments: 215,
        shares: 980,
    },
    {
        id: 3,
        username: "CookingMaster",
        title: "Easy 15-Minute Dinner Recipe Everyone Will Love",
        views: 210000,
        likes: 15400,
        comments: 620,
        shares: 3500,
    },
    {
        id: 4,
        username: "TravelExplorer",
        title: "Hidden Gems in Bali You Need to Visit",
        views: 175000,
        likes: 12300,
        comments: 430,
        shares: 2800,
    },
    {
        id: 5,
        username: "PetLover",
        title: "Cutest Dog Tricks - How to Train Your Puppy",
        views: 320000,
        likes: 28900,
        comments: 1250,
        shares: 5600,
    },
    {
        id: 6,
        username: "FashionTrends",
        title: "Summer Outfit Ideas - Look Stylish This Season",
        views: 143000,
        likes: 9800,
        comments: 385,
        shares: 1700,
    },
    {
        id: 7,
        username: "LifeHacker",
        title: "10 Productivity Tips That Actually Work",
        views: 267000,
        likes: 19500,
        comments: 830,
        shares: 4200,
    },
    {
        id: 8,
        username: "ArtisticSoul",
        title: "Beginner's Guide to Watercolor Painting",
        views: 98000,
        likes: 7100,
        comments: 290,
        shares: 1100,
    },
    {
        id: 9,
        username: "MusicMaestro",
        title: "Learn This Popular Song in 10 Minutes",
        views: 185000,
        likes: 13600,
        comments: 520,
        shares: 2400,
    },
    {
        id: 10,
        username: "ComedyKing",
        title: "Try Not to Laugh Challenge - Impossible Edition",
        views: 430000,
        likes: 38200,
        comments: 1850,
        shares: 7300,
    },
];

export default function VideosTab() {
    const itemsPerPage = 10;
    const [currentItems, setCurrentItems] = useState<Video[]>(videosData.slice(0, itemsPerPage));
    const handleSetCurrentItems = useCallback((items: Video[]) => {
        setCurrentItems(items);
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Videos</h2>
            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px] text-center">CREATOR</TableHead>
                            <TableHead className="text-center">VIDEO TITLE</TableHead>
                            <TableHead className="text-center">VIEWS</TableHead>
                            <TableHead className="text-center">LIKES</TableHead>
                            <TableHead className="text-center">COMMENTS</TableHead>
                            <TableHead className="text-center">SHARES</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map((video) => (
                            <TableRow key={video.id}>
                                <TableCell className="font-medium py-3 text-center">{video.username}</TableCell>
                                <TableCell className="text-center">{video.title}</TableCell>
                                <TableCell className="text-center">{video.views.toLocaleString()}</TableCell>
                                <TableCell className="text-center">{video.likes.toLocaleString()}</TableCell>
                                <TableCell className="text-center">{video.comments.toLocaleString()}</TableCell>
                                <TableCell className="text-center">{video.shares.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <ChallenzPagination items={videosData} itemsPerPage={itemsPerPage} setCurrentItems={handleSetCurrentItems} />
        </div>
    );
}
