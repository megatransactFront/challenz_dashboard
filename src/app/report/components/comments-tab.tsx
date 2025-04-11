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

interface Comment {
    id: number;
    username: string;
    comment: string;
    likes: number;
    reports: number | null;
    replies: number | null;
}

const commentsData: Comment[] = [
    {
        id: 1,
        username: "Jacob Evans",
        comment: "This workout was intense! I'm definitely feeling the burn. Can't wait to try it again tomorrow!",
        likes: 74,
        reports: null,
        replies: 40,
    },
    {
        id: 2,
        username: "Stephanie Kerr",
        comment: "Wow, this recipe looks amazing! I love how simple it is. I'm going to make this for dinner tonight!",
        likes: 74,
        reports: 1,
        replies: 60,
    },
    {
        id: 3,
        username: "Caitlin James",
        comment: "This place looks beautiful! Adding it to my bucket list. Thanks for sharing your adventure!",
        likes: 74,
        reports: null,
        replies: null,
    },
    {
        id: 4,
        username: "Ramona Hill",
        comment: "Aww, your dog is so adorable! I can't believe how fluffy he is!",
        likes: 56,
        reports: null,
        replies: null,
    },
    {
        id: 5,
        username: "Martha Stewart",
        comment: "Love these outfits! Where did you get that jacket? I need it in my life!",
        likes: 456,
        reports: null,
        replies: 9,
    },
    {
        id: 6,
        username: "Max Wild",
        comment: "These tips are super useful! I can't believe I didn't think of that before. Thanks for sharing",
        likes: 6789,
        reports: null,
        replies: 10,
    },
    {
        id: 7,
        username: "Jonathan Price",
        comment: "I'm dying 😂 This is the funniest thing I've seen all week! Keep it up!",
        likes: 32,
        reports: 5,
        replies: 60,
    },
    {
        id: 8,
        username: "Martin Gore",
        comment: "This was so helpful! I'm trying to improve my painting skills, and your tips are just what I needed",
        likes: 2000,
        reports: null,
        replies: 50,
    },
    {
        id: 9,
        username: "John Cenat",
        comment: "Your voice is incredible! This cover gave me chills. Please do more songs like this!",
        likes: 5000,
        reports: null,
        replies: null,
    },
    {
        id: 10,
        username: "Jai Liger",
        comment: "Your voice is incredible! Love this Challenge Response!!!",
        likes: 20000,
        reports: null,
        replies: 234,
    },
];

export default function CommentsTab() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(commentsData.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = commentsData.slice(indexOfFirstItem, indexOfLastItem);

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
            <h2 className="text-2xl font-semibold">Dance Challenge Comments</h2>
            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px] text-center">USERNAME</TableHead>
                            <TableHead className="text-center">COMMENT</TableHead>
                            <TableHead className="text-center">COMMENT LIKES</TableHead>
                            <TableHead className="text-center">REPORTS</TableHead>
                            <TableHead className="text-center">REPLIES</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map((comment) => (
                            <TableRow key={comment.id}>
                                <TableCell className="font-medium text-center">{comment.username}</TableCell>
                                <TableCell className="text-center">{comment.comment}</TableCell>
                                <TableCell className="text-center">{comment.likes}</TableCell>
                                <TableCell className="text-center">{comment.reports || "-"}</TableCell>
                                <TableCell className="text-center">{comment.replies || "-"}</TableCell>
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
