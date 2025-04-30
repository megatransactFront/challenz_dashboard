"use client";
import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Link, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import useMobile from '@/hooks/useMobile';
import { Button } from '@/components/ui/button';


export function DiscountsTable({ discountsInfo }: any) {
    const itemsPerPage = 8;
    const isMobile = useMobile();

    return (
        <>
            <div className="bg-white  pt-6 rounded-lg shadow-sm">
                <div className="flex mx-6 md:mr-20 justify-between items-center mb-6">
                    <h2 className=" text-md sm:text-xl font-bold">Discounts</h2>

                    <div className='flex justify-end md:justify-between gap-4'>
                        {
                            isMobile ? (
                                <>
                                    <Search className='w-8 h-8' />
                                </>
                            ) : (
                                <>
                                    <div className="relative w-[300px]">
                                        <X className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer" />
                                        <Input
                                            type="search"
                                            placeholder="Search Account"
                                            className="pl-4 min-h-[45px]"
                                        />
                                    </div>
                                </>
                            )
                        }

                    </div>

                </div>

                <Table>
                    <TableHeader >
                        <TableRow>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">DATE PURCHASED</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">STORE NAME</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">ITEM</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">TOTAL COST</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">DISCOUNT TIER</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center text-black">DISCOUNT TOTAL</TableHead>
                            <TableHead className="bg-[#F7F9FC] text-center text-blac">CHALLENZ PROFIT</TableHead>
                        </TableRow>
                    </TableHeader>
                    {
                        discountsInfo ? (<TableBody>
                            {discountsInfo.slice(0, itemsPerPage)
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
                        </TableBody>) : null
                    }
                </Table>

                {!discountsInfo && <div className='flex w-full h-20 mx-auto justify-center items-center'>
                    No data available
                </div>}
            </div>
            {/* Pagination */}
            {/* <ChallenzPagination items={discountsInfo} itemsPerPage={itemsPerPage} setCurrentItems={setCurrentItems} /> */}
            <div className="flex justify-between items-center mb-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-lg bg-gray-500 hover:bg-[#707070] text-white"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <div className="flex items-center">
                    <Button
                        variant="default"
                        className="w-12 h-12 rounded-lg bg-primary text-white"
                    >
                        1
                    </Button>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-lg bg-gray-500 hover:bg-[#707070] text-white"
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </>
    );
}