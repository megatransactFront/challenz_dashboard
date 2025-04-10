// app/dashboard/components/coins/CoinTransactionTable.tsx
"use client";

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CoinTransaction } from '@/app/types/coins';

interface CoinTransactionTableProps {
    transactions: CoinTransaction[];
}

export function CoinTransactionTable({ transactions }: CoinTransactionTableProps) {
    return (
        <div className="rounded-md border">
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
                    {transactions.map((transaction, index) => (
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
    );
}
