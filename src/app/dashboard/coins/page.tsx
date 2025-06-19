// app/dashboard/coins/page.tsx
"use client";
import { CoinTransactionTable } from '@/app/dashboard/components/coins/CoinTransactionTable';
import { CoinData } from '@/app/types/coins';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import CoinsMetrics from '../components/coins/CoinsMetrics';
import Pagination from '../components/shared/Pagination';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export default function CoinsPage() {
    // State management
    const [coinData, setCoinData] = useState<CoinData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const limit = 10;
    const router = useRouter();

    useEffect(() => {
        const channel = supabase
            .channel("realtime coins")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "coin_transactions",
                },
                async () => {
                    await fetchCoinData();
                }
            ).on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "users",
                },
                async () => {
                    await fetchCoinData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, router]);

    const fetchCoinData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/dashboard/coins?page=${page}&limit=${limit}`);

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
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        fetchCoinData();
        setIsLoading(false);
    }, [page]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        );
    }

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
            <CoinTransactionTable usersMetrics={coinData?.userMetrics} />
            <Pagination
                page={page}
                totalPages={coinData.totalUsersPage}
                onPageChange={setPage} />
        </div >
    );
}
