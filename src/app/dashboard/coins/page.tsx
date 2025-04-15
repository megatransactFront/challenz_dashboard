// app/dashboard/coins/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CoinData } from '@/app/types/coins';
import { CoinTransactionTable } from '@/app/dashboard/components/coins/CoinTransactionTable';
import CoinsMetrics from '../components/coins/CoinsMetrics';
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const usersTransactions = [
    {
        userId: 1,
        name: "Jeremy Evans",
        uwcEarnedToday: 100,
        uwcEarnedTotal: 725,
        uwcSpentToday: 150,
        uwcSpentTotal: 250,
        uwcBalance: 475,
        transactions: [
            { date: "24 Mar 2020", partnerShop: "Apple Store", uwcSpent: 50 },
            { date: "18 Mar 2020", partnerShop: "Spotify", uwcSpent: 50 },
            { date: "12 Mar 2020", partnerShop: "JetStar", uwcSpent: 50 }
        ]
    },
    {
        userId: 2,
        name: "Ricky Starks",
        uwcEarnedToday: 100,
        uwcEarnedTotal: 725,
        uwcSpentToday: 150,
        uwcSpentTotal: 250,
        uwcBalance: 475,
        transactions: [
            { date: "22 Mar 2020", partnerShop: "PB Tech", uwcSpent: 50 },
            { date: "19 Mar 2020", partnerShop: "Mecca Beauty", uwcSpent: 50 },
            { date: "10 Mar 2020", partnerShop: "Apple Music", uwcSpent: 50 }
        ]
    },
    {
        userId: 3,
        name: "Liv Magan",
        uwcEarnedToday: 100,
        uwcEarnedTotal: 725,
        uwcSpentToday: 150,
        uwcSpentTotal: 250,
        uwcBalance: 475,
        transactions: [
            { date: "21 Mar 2020", partnerShop: "Farmers", uwcSpent: 50 },
            { date: "17 Mar 2020", partnerShop: "Warehouse Stationary", uwcSpent: 50 },
            { date: "11 Mar 2020", partnerShop: "Air New Zealand", uwcSpent: 50 }
        ]
    },
    {
        userId: 4,
        name: "Caleb Bane",
        uwcEarnedToday: 100,
        uwcEarnedTotal: 725,
        uwcSpentToday: 150,
        uwcSpentTotal: 250,
        uwcBalance: 475,
        transactions: [
            { date: "23 Mar 2020", partnerShop: "Apple Store", uwcSpent: 50 },
            { date: "20 Mar 2020", partnerShop: "Spotify", uwcSpent: 50 },
            { date: "13 Mar 2020", partnerShop: "JetStar", uwcSpent: 50 }
        ]
    },
    {
        userId: 5,
        name: "Cade Green",
        uwcEarnedToday: 100,
        uwcEarnedTotal: 725,
        uwcSpentToday: 150,
        uwcSpentTotal: 250,
        uwcBalance: 475,
        transactions: [
            { date: "24 Mar 2020", partnerShop: "Boadertown", uwcSpent: 50 },
            { date: "19 Mar 2020", partnerShop: "PB Tech", uwcSpent: 50 },
            { date: "14 Mar 2020", partnerShop: "Farmers", uwcSpent: 50 }
        ]
    },
    {
        userId: 6,
        name: "Jalen Bourn",
        uwcEarnedToday: 100,
        uwcEarnedTotal: 725,
        uwcSpentToday: 150,
        uwcSpentTotal: 250,
        uwcBalance: 475,
        transactions: [
            { date: "22 Mar 2020", partnerShop: "Apple Music", uwcSpent: 50 },
            { date: "18 Mar 2020", partnerShop: "Mecca Beauty", uwcSpent: 50 },
            { date: "16 Mar 2020", partnerShop: "Spotify", uwcSpent: 50 }
        ]
    },
    {
        userId: 7,
        name: "Matt Jane",
        uwcEarnedToday: 100,
        uwcEarnedTotal: 725,
        uwcSpentToday: 150,
        uwcSpentTotal: 250,
        uwcBalance: 475,
        transactions: [
            { date: "25 Mar 2020", partnerShop: "JetStar", uwcSpent: 50 },
            { date: "20 Mar 2020", partnerShop: "Apple Store", uwcSpent: 50 },
            { date: "15 Mar 2020", partnerShop: "PB Tech", uwcSpent: 50 }
        ]
    },
    {
        userId: 8,
        name: "Jules Grant",
        uwcEarnedToday: 100,
        uwcEarnedTotal: 725,
        uwcSpentToday: 150,
        uwcSpentTotal: 250,
        uwcBalance: 475,
        transactions: [
            { date: "23 Mar 2020", partnerShop: "Warehouse Stationary", uwcSpent: 50 },
            { date: "18 Mar 2020", partnerShop: "Boadertown", uwcSpent: 50 },
            { date: "12 Mar 2020", partnerShop: "Apple Music", uwcSpent: 50 }
        ]
    }
];
export default function CoinsPage() {
    // State management
    const [coinData, setCoinData] = useState<CoinData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
                    await reFetchCoinData();
                }
            ).on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "users",
                },
                async () => {
                    await reFetchCoinData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, router]);
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
    const reFetchCoinData = async () => {
        try {
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
        }
    };
    useEffect(() => {
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
            <CoinTransactionTable transactions={usersTransactions} />
        </div>
    );
}
