// app/dashboard/coins/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Coins, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CoinData } from '@/app/types/coins';

export default function CoinsPage() {
    // State management
    const [coinData, setCoinData] = useState<CoinData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchCoinData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/dashboard/coins');

                if (!response.ok) {
                    throw new Error('Failed to fetch coin data');
                }

                const data = await response.json();
                setCoinData(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching coin data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCoinData();
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    // No data state
    if (!coinData) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#1F5C71] flex items-center justify-center mr-4">
                            <Coins className="h-6 w-6 text-white" />
                        </div>
                        <span>Total Uwaci Coins</span>
                    </div>
                    <div className="text-3xl font-bold">$1.3 Billion</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#1F5C71] flex items-center justify-center mr-4">
                            <Coins className="h-6 w-6 text-white" />
                        </div>
                        <span>Coins Earned</span>
                    </div>
                    <div className="text-3xl font-bold text-green-500">+700 mil</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#1F5C71] flex items-center justify-center mr-4">
                            <Coins className="h-6 w-6 text-white" />
                        </div>
                        <span>Coins Spent</span>
                    </div>
                    <div className="text-3xl font-bold text-red-500">-650 mil</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#1F5C71] flex items-center justify-center mr-4">
                            <Coins className="h-6 w-6 text-white" />
                        </div>
                        <span>Total Difference</span>
                    </div>
                    <div className="text-3xl font-bold text-green-500">+150 mil</div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Uwaci Coins</h2>
                    <select className="border rounded-md p-2 min-w-[150px]">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                    </select>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>DATE</TableHead>
                            <TableHead>TOTAL LIKES</TableHead>
                            <TableHead>TOTAL REFERRALS</TableHead>
                            <TableHead>TOTAL SHARES</TableHead>
                            <TableHead>CHALLENGES MADE</TableHead>
                            <TableHead>BADGES RECEIVED</TableHead>
                            <TableHead className="bg-green-50">TOTAL EARNED</TableHead>
                            <TableHead className="bg-red-50">TOTAL SPENT</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coinData.transactions
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((transaction, index) => (
                                <TableRow key={index}>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell>${transaction.totalLikes}</TableCell>
                                    <TableCell>${transaction.totalReferrals}</TableCell>
                                    <TableCell>${transaction.totalShares}</TableCell>
                                    <TableCell>${transaction.challengesMade}</TableCell>
                                    <TableCell>${transaction.badgesReceived}</TableCell>
                                    <TableCell className="text-green-600 font-medium">+${transaction.totalEarned}</TableCell>
                                    <TableCell className="text-red-600 font-medium">-${transaction.totalSpent}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mb-12">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
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
                        1
                    </Button>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(coinData.transactions.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(coinData.transactions.length / itemsPerPage)}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
}
