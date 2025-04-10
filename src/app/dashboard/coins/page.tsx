// app/dashboard/coins/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { Coins, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CoinData } from '@/app/types/coins';
import { CoinTransactionTable } from '@/app/dashboard/components/coins/CoinTransactionTable';
import CoinsMetrics from '../components/coins/coins-metrics';

export default function CoinsPage() {
    // State management
    const [coinData, setCoinData] = useState<CoinData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoinData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/dashboard/coins');

                if (!response.ok) {
                    throw new Error('Failed to fetch coin data');
                }

                const data = await response.json();
                setCoinData(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching coin data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCoinData();
    }, []);

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
            <CoinTransactionTable transactions={coinData?.transactions} />
        </div>
    );
}
