// app/dashboard/coins/page.tsx
"use client";
import { CoinTransactionTable } from '@/app/dashboard/components/coins/CoinTransactionTable';
import { CoinData } from '@/app/types/coins';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { debounce } from 'lodash';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CoinsMetrics from '../components/coins/CoinsMetrics';
import Pagination from '../components/shared/Pagination';
export default function CoinsPage() {
    // State management
    const [coinData, setCoinData] = useState<CoinData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');

    const limit = 10;
    const fetchCoinData = async (keyword?: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/dashboard/coins?page=${page}&limit=${limit}&keyword=${keyword}`);

            if (!response.ok) {
                throw new Error('Failed to fetch coin data');
            }

            const data = await response.json();
            setCoinData(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching coin data:', err);
        }
        setIsLoading(false)
    };

    useEffect(() => {
        fetchCoinData();
    }, [page]);

    useEffect(() => {
        if (keyword.trim()) {
            debouncedSearch(keyword);
        }
        else {
            fetchCoinData();
        }

        return () => {
            debouncedSearch.cancel();
        };
    }, [keyword]);

    const debouncedSearch = useMemo(
        () =>
            debounce((keyword: string) => {
                fetchCoinData(keyword);
            }, 500),
        []
    );

    // Error state
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    // No data state
    if (!coinData) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <CoinsMetrics metrics={coinData?.metrics} />
            {
                isLoading ? (<div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>) :
                    <CoinTransactionTable
                        usersMetrics={coinData?.userMetrics}
                        handleKeywordChange={setKeyword}
                        keyword={keyword} />
            }

            <Pagination
                page={page}
                totalPages={coinData.totalUsersPage}
                onPageChange={setPage} />
        </div >
    );
}
