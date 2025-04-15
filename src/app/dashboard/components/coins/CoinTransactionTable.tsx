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
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { UserMetrics } from '@/app/types';

interface CoinTransactionTableProps {
    usersMetrics: UserMetrics[];
}

export function CoinTransactionTable({ usersMetrics }: CoinTransactionTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [timeframe, setTimeFrame] = useState('');
    const handleTimeFrameChange = (value: string) => {
        setTimeFrame(value);
        console.log(`Fetching data for ${value} timeframe`);
    };
    // No data state
    if (!usersMetrics) {
        return null;
    }
    return (
        <>
            {/* Transactions Table */}
            <div className="bg-white p-1 pt-6 rounded-lg shadow-sm">
                <div className="flex ml-6 mr-20 justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Uwaci Coins</h2>
                    <div className='flex justify-between gap-4'>
                        <div className="relative w-[150px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-10 min-h-[45px]"
                            />
                        </div>
                        <Select onValueChange={handleTimeFrameChange} defaultValue={timeframe}>
                            <SelectTrigger className="w-[150px] min-h-[45px]" >
                                <SelectValue placeholder="Filter" />
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
                </div>

                <Table>
                    <TableHeader >
                        <TableRow>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">USER</TableHead>
                            <TableHead className="bg-[#C6F1CC] text-center text-black">UWC EARNED TODAY</TableHead>
                            <TableHead className="bg-[#C6F1CC] text-center text-black">UWC EARNED TOTAL</TableHead>
                            <TableHead className="bg-[#FFACB7] text-center text-black">UWC SPENT TODAY</TableHead>
                            <TableHead className="bg-[#FFACB7] text-center text-black">UWC SPENT TOTAL</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">UWC BALANCE</TableHead>
                            <TableHead className="bg-[#1F5C71] text-center text-white">TRANSACTION HISTORY</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {usersMetrics
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((metrics: any, index: any) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">{metrics.name}</TableCell>
                                    <TableCell className="text-center text-[#34A853] font-medium">${metrics.uwcEarnedToday}</TableCell>
                                    <TableCell className="text-center text-[#34A853] font-medium">${metrics.uwcEarnedTotal}</TableCell>
                                    <TableCell className="text-center text-[#FF4C51] font-medium">${metrics.uwcSpentToday}</TableCell>
                                    <TableCell className="text-center text-[#FF4C51] font-medium">${metrics.uwcSpentTotal}</TableCell>
                                    <TableCell className="text-center">${metrics.uwcBalance}</TableCell>
                                    <TableCell className="text-center text-[#1F5C71] underline cursor-pointer">
                                        <Link href={`/dashboard/coins/history/${metrics.userId}`}>
                                            View
                                        </Link>
                                    </TableCell>
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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(usersMetrics.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(usersMetrics.length / itemsPerPage)}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </>
    );
}
