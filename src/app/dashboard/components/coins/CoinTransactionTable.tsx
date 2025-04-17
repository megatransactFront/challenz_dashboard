"use client";
import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { UserMetrics } from '@/app/types';
import ChallenzPagination from '@/components/ChallenzPagination';


interface CoinTransactionTableProps {
    usersMetrics: UserMetrics[];
}

export function CoinTransactionTable({ usersMetrics }: CoinTransactionTableProps) {
    const itemsPerPage = 8;
    const [timeframe, setTimeFrame] = useState('');
    const [currentItems, setCurrentItems] = useState(usersMetrics.slice(0, itemsPerPage));
    const handleTimeFrameChange = (value: string) => {
        setTimeFrame(value);
        console.log(`Filtering data for ${value} timeframe`);
    };
    // No data state
    if (!usersMetrics) {
        return null;
    }

    return (
        <>
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
                            <TableHead className="bg-primary text-center text-white">TRANSACTION HISTORY</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems
                            .map((metrics: any, index: any) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">{metrics.name}</TableCell>
                                    <TableCell className="text-center text-[#34A853]">+{metrics.uwcEarnedToday} UWC</TableCell>
                                    <TableCell className="text-center text-[#34A853]">+{metrics.uwcEarnedTotal} UWC</TableCell>
                                    <TableCell className="text-center text-[#FF4C51]">-{metrics.uwcSpentToday} UWC</TableCell>
                                    <TableCell className="text-center text-[#FF4C51]">-{metrics.uwcSpentTotal} UWC</TableCell>
                                    <TableCell className="text-center">${metrics.uwcBalance} UWC</TableCell>
                                    <TableCell className="text-center text-primary underline cursor-pointer">
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
            <ChallenzPagination items={usersMetrics} itemsPerPage={itemsPerPage} setCurrentItems={setCurrentItems} />
        </>
    );
}