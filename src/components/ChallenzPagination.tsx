'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

const ChallenzPagination = ({ items = [], itemsPerPage = 10, setCurrentItems }: { items: Array<any>, itemsPerPage?: number, setCurrentItems: (data: any) => void }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(items?.length / itemsPerPage);

    // Get current items
    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = items?.slice(indexOfFirstItem, indexOfLastItem);
        setCurrentItems(currentItems);
    }
        , [currentPage, items, itemsPerPage, setCurrentItems]);
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    return (
        <div className="flex justify-between items-center mb-2">
            <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-lg bg-gray-500 hover:bg-[#707070] text-white"
                onClick={goToPreviousPage}
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
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-6 w-6" />
            </Button>
        </div>
    )
}

export default ChallenzPagination
