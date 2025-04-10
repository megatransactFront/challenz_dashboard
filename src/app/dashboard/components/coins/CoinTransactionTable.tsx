// app/dashboard/components/coins/CoinTransactionTable.tsx
"use client";

import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CoinData, CoinTransaction } from '@/app/types/coins';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface CoinTransactionTableProps {
    transactions: CoinTransaction[];
}

export function CoinTransactionTable({ transactions }: CoinTransactionTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // No data state
    if (!transactions) {
        return null;
    }
    return (
        <>
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
                            <TableHead className="bg-[#56E45866]">TOTAL EARNED</TableHead>
                            <TableHead className="bg-[#E4566466]">TOTAL SPENT</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((transaction, index) => (
                                <TableRow key={index}>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell>${transaction.totalLikes}</TableCell>
                                    <TableCell>${transaction.totalReferrals}</TableCell>
                                    <TableCell>${transaction.totalShares}</TableCell>
                                    <TableCell>${transaction.challengesMade}</TableCell>
                                    <TableCell>${transaction.badgesReceived}</TableCell>
                                    <TableCell className="text-[#34A853] font-medium">+${transaction.totalEarned}</TableCell>
                                    <TableCell className="text-[#E45664] font-medium">-${transaction.totalSpent}</TableCell>
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
                        {currentPage}
                    </Button>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(transactions.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(transactions.length / itemsPerPage)}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </>
    );
}
