"use client";
import { downloadCSV } from '@/app/api/dashboard/coins/helpers';
import { CoinTransaction } from '@/app/types';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDate } from '@/helpers/formater';
import { Download } from 'lucide-react';

type TransactionHistoryTableProps = {
    transactions: CoinTransaction[];
    page: number;
    itemsPerPage: number;
    filename: string
}

export function TransactionHistoryTable({ transactions, page, itemsPerPage, filename }: TransactionHistoryTableProps) {
    // No data state
    if (!transactions.length) {
        return <div className="flex justify-center items-center min-h-[400px] text-gray-500 p-4">
            No transactions found for the selected.
        </div>;
    }
    return (
        <>
            {/* Transactions Table */}
            <div className="bg-white p-1 rounded-lg shadow-sm mb-6">
                <div className="flex mx-6 justify-between gap-3 items-center my-3">
                    <Button className="ml-auto max-w-[200px] min-h-[20px] rounded-[30px] bg-[#E45664] font-medium"
                        onClick={() => {
                            // Handle download logic here
                            const headers = ['Transaction Date', 'Transaction Type', 'Amount'];
                            downloadCSV(
                                transactions.map(t => ({
                                    created_at: formatDate(t.created_at),
                                    type: t.type,
                                    amount: t.amount
                                })),
                                headers,
                                filename
                            );
                        }}>
                        < Download className='w-8 h-8' />
                        Download
                    </Button>
                </div>

                <Table>
                    <TableHeader >
                        <TableRow>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">TRANSACTION DATE</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">TRANSACTION TYPE</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">AMOUNT</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.slice((page - 1) * itemsPerPage, page * itemsPerPage)
                            .map((transaction: CoinTransaction, index: any) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">{formatDate(transaction.created_at)}</TableCell>
                                    <TableCell
                                        className={`text-center ${transaction.type === 'credit' ? 'text-red-500' : 'text-green-500'}`}
                                    >
                                        {transaction.type}
                                    </TableCell>
                                    <TableCell className="text-center">${transaction.amount}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div >
        </>
    );
}
