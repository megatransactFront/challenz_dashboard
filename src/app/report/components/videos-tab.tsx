"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(videosData.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = videosData.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Popular Challenge Videos</h2>
            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">CREATOR</TableHead>
                            <TableHead>VIDEO TITLE</TableHead>
                            <TableHead className="text-center">VIEWS</TableHead>
                            <TableHead className="text-center">LIKES</TableHead>
                            <TableHead className="text-center">COMMENTS</TableHead>
                            <TableHead className="text-center">SHARES</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map((video) => (
                            <TableRow key={video.id}>
                                <TableCell className="font-medium">{video.username}</TableCell>
                                <TableCell>{video.title}</TableCell>
                                <TableCell className="text-center">{video.views.toLocaleString()}</TableCell>
                                <TableCell className="text-center">{video.likes.toLocaleString()}</TableCell>
                                <TableCell className="text-center">{video.comments.toLocaleString()}</TableCell>
                                <TableCell className="text-center">{video.shares.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mb-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-lg bg-gray-500 hover:bg-[#707070] text-white"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <div className="flex items-center">
                    <Button
                        variant="default"
                        className="w-12 h-12 rounded-lg bg-[#1F5C71] text-white"
                    >
                        {currentPage}
                    </Button>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-lg bg-gray-500 hover:bg-[#707070] text-white"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
}
