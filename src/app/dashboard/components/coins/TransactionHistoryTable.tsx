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
import { Download } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChallenzPagination from '@/components/ChallenzPagination';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
export function TransactionHistoryTable({ transactions }: { transactions: any }) {
    const itemsPerPage = 8;
    const [currentItems, setCurrentItems] = useState(transactions.slice(0, itemsPerPage))
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
                        {currentItems
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
            {/* <ChallenzPagination items={transactions} itemsPerPage={itemsPerPage} setCurrentItems={setCurrentItems} /> */}
        </>
    );
}
