"use client";
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CoinTransaction } from '@/app/types/coins';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChallenzPagination from '@/components/ChallenzPagination';
import { formatDateWithSign } from '@/helpers/formater';

interface CoinTransactionTableProps {
    transactions: CoinTransaction[];
}

export function CoinTransactionTable({ transactions }: CoinTransactionTableProps) {
    const itemsPerPage = 8;
    const [currentItems, setCurrentItems] = useState(transactions.slice(0, itemsPerPage));
    const [timeframe, setTimeFrame] = useState('daily');
    const handleTimeFrameChange = (value: string) => {
        setTimeFrame(value);
        console.log(`Fetching data for ${value} timeframe`);
    };
    // No data state
    if (!transactions) {
        return null;
    }
    return (
        <>
            {/* Transactions Table */}
            <div className="bg-white p-1 pt-6 rounded-lg shadow-sm">
                <div className="flex ml-6 mr-20 justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Uwaci Coins</h2>
                    <Select onValueChange={handleTimeFrameChange} defaultValue={timeframe}>
                        <SelectTrigger className="w-[150px]" >
                            <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">YearKy</SelectItem>
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
                        {currentItems
                            .map((transaction, index) => (
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

            {/* Pagination */}
            <ChallenzPagination items={transactions} itemsPerPage={itemsPerPage} setCurrentItems={setCurrentItems} />
        </>
    );
}
