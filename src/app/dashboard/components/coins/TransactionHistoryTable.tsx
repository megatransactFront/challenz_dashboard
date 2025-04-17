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
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
export function TransactionHistoryTable({ transactions }: { transactions: any }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [timeframe, setTimeFrame] = useState('');
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
            <div className="bg-white p-1 rounded-lg shadow-sm mb-6">
                <div className="flex mx-6 justify-between items-center my-3">
                    <Select onValueChange={handleTimeFrameChange} defaultValue={timeframe}>
                        <SelectTrigger className="w-[200px] min-h-[45px] rounded-[30px]" >
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
                    <Button className="w-[200px] min-h-[50px] rounded-[30px] bg-[#E45664] font-medium">
                        <Download className='w-8 h-8' />
                        Download
                    </Button>
                </div>

                <Table>
                    <TableHeader >
                        <TableRow>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">TRANSACTION DATE</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">PARTNER SHOP</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">UWC SPENT</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions
                            .map((transaction: any, index: any) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">{formatDate(transaction.date)}</TableCell>
                                    <TableCell className="text-center">{transaction.partnerShop}</TableCell>
                                    <TableCell className="text-center">${transaction.uwcSpent}</TableCell>
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
                        className="w-12 h-12 rounded-lg bg-primary text-white"
                    >
                        {currentPage}
                    </Button>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-lg bg-gray-500 hover:bg-[#707070] text-white"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(transactions?.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(transactions?.length / itemsPerPage)}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </>
    );
}
