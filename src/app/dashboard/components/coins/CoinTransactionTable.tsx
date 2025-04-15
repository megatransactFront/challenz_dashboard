"use client";
import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { CoinTransaction } from '@/app/types/coins';
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import ChallenzPagination from '@/components/ChallenzPagination';
import { formatDateWithSign } from '@/helpers/formater';

interface CoinTransactionTableProps {
    transactions: CoinTransaction[];
}

export function CoinTransactionTable({ transactions }: CoinTransactionTableProps) {
    const itemsPerPage = 8;
    const [filteredTransactions, setFilteredTransactions] = useState<CoinTransaction[]>([]);
    const [currentItems, setCurrentItems] = useState<CoinTransaction[]>([]);
    const [timeframe, setTimeFrame] = useState('daily');

    useEffect(() => {
        const now = new Date();

        // Sort the transactions by date descending (latest first)
        const sortedTransactions = [...transactions].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const filterByTimeframe = (timeframe: string) => {
            return sortedTransactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                const diffTime = now.getTime() - transactionDate.getTime();
                const diffDays = diffTime / (1000 * 3600 * 24);

                switch (timeframe) {
                    case 'daily':
                        return diffDays <= 1;
                    case 'weekly':
                        return diffDays <= 7;
                    case 'monthly':
                        return diffDays <= 30;
                    case 'yearly':
                        return diffDays <= 365;
                    default:
                        return true;
                }
            });
        };

        const filtered = filterByTimeframe(timeframe);
        setFilteredTransactions(filtered);
        setCurrentItems(filtered.slice(0, itemsPerPage));
    }, [transactions, timeframe]);

    const handleTimeFrameChange = (value: string) => {
        setTimeFrame(value);
        console.log(`Filtering data for ${value} timeframe`);
    };

    if (!transactions) return null;

    return (
        <>
            <div className="bg-white p-1 pt-6 rounded-lg shadow-sm">
                <div className="flex ml-6 mr-20 justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Uwaci Coins</h2>
                    <Select onValueChange={handleTimeFrameChange} defaultValue={timeframe}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select Timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-[#F7F9FC] text-center">DATE</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center">TOTAL LIKES</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center">TOTAL REFERRALS</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center">TOTAL SHARES</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center">CHALLENGES MADE</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center">BADGES RECEIVED</TableHead>
                            <TableHead className="bg-[#56E45866] text-center">TOTAL EARNED</TableHead>
                            <TableHead className="bg-[#E4566466] text-center">TOTAL SPENT</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map((transaction, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-center">{formatDateWithSign(transaction.date, "/")}</TableCell>
                                <TableCell className="text-center">${transaction.totalLikes}</TableCell>
                                <TableCell className="text-center">${transaction.totalReferrals}</TableCell>
                                <TableCell className="text-center">${transaction.totalShares}</TableCell>
                                <TableCell className="text-center">${transaction.challengesMade}</TableCell>
                                <TableCell className="text-center">${transaction.badgesReceived}</TableCell>
                                <TableCell className="text-center text-[#34A853] font-medium">+${transaction.totalEarned}</TableCell>
                                <TableCell className="text-center text-[#E45664] font-medium">-${transaction.totalSpent}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <ChallenzPagination
                items={filteredTransactions}
                itemsPerPage={itemsPerPage}
                setCurrentItems={setCurrentItems}
            />
        </>
    );
}