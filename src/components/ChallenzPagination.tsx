'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'

const ChallenzPagination = ({ currentPage, totalPages, setCurrentPage }: { currentPage: number, totalPages: number, setCurrentPage: (page: number) => void }) => {
    function goToPreviousPage() {
        setCurrentPage(currentPage - 1);
    }

    function goToNextPage() {
        setCurrentPage(currentPage + 1);

    }

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
