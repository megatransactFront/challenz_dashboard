// app/api/dashboard/coins/route.ts
import { NextResponse } from 'next/server';
import { CoinData, UserMetrics } from '@/app/types/coins';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export async function GET() {
    try {
        // Mock data for demonstration purposes
        // In a real application, this would fetch data from a database or external API

        const usersMetrics: UserMetrics[] = [
            {
                userId: '1',
                name: "Jeremy Evans",
                uwcEarnedToday: 100,
                uwcEarnedTotal: 725,
                uwcSpentToday: 150,
                uwcSpentTotal: 250,
                uwcBalance: 475
            },
            {
                userId: '2',
                name: "Ricky Starks",
                uwcEarnedToday: 100,
                uwcEarnedTotal: 725,
                uwcSpentToday: 150,
                uwcSpentTotal: 250,
                uwcBalance: 475
            },
            {
                userId: '3',
                name: "Liv Magan",
                uwcEarnedToday: 100,
                uwcEarnedTotal: 725,
                uwcSpentToday: 150,
                uwcSpentTotal: 250,
                uwcBalance: 475
            },
            {
                userId: '4',
                name: "Caleb Bane",
                uwcEarnedToday: 100,
                uwcEarnedTotal: 725,
                uwcSpentToday: 150,
                uwcSpentTotal: 250,
                uwcBalance: 475
            },
            {
                userId: '5',
                name: "Cade Green",
                uwcEarnedToday: 100,
                uwcEarnedTotal: 725,
                uwcSpentToday: 150,
                uwcSpentTotal: 250,
                uwcBalance: 475
            },
            {
                userId: '6',
                name: "Jalen Bourn",
                uwcEarnedToday: 100,
                uwcEarnedTotal: 725,
                uwcSpentToday: 150,
                uwcSpentTotal: 250,
                uwcBalance: 475
            },
            {
                userId: '7',
                name: "Matt Jane",
                uwcEarnedToday: 100,
                uwcEarnedTotal: 725,
                uwcSpentToday: 150,
                uwcSpentTotal: 250,
                uwcBalance: 475
            },
            {
                userId: '8',
                name: "Jules Grant",
                uwcEarnedToday: 100,
                uwcEarnedTotal: 725,
                uwcSpentToday: 150,
                uwcSpentTotal: 250,
                uwcBalance: 475

            }
        ];

        const [coinsListResponse, coinsInTransactionsResponse] = await Promise.all([
            supabase.from('users').select('coins'),
            supabase.from('coin_transactions').select('amount')
        ]);

        const { data: coinsList, error: coinsListError } = coinsListResponse;
        const { data: coinsInTransactions, error: coinsInTransactionsError } = coinsInTransactionsResponse;

        if (coinsListError) {
            console.error('Error fetching coins list:', coinsListError);
            throw coinsListError;
        }
        if (coinsInTransactionsError) {
            console.error('Error fetching coins in transactions:', coinsInTransactionsError);
            throw coinsInTransactionsError;
        }

        const totalCoins = coinsList.reduce((acc, user) => acc + (user.coins || 0), 0);
        const totalCoinsEarned = coinsInTransactions.reduce((acc, transaction) => acc + (transaction.amount || 0), 0);
        const totalCoinsSpent = 0.25; // Example value, replace with actual calculation
        const totalDifference = totalCoinsEarned - totalCoinsSpent;
        const formatNumber = (num: number) => {
            if (num >= 1_000_000_000) {
                return `${(num / 1_000_000_000).toFixed(1)} Billion`;
            } else if (num >= 1_000_000) {
                return `${(num / 1_000_000).toFixed(1)} mil`;
            }
            return `${num.toLocaleString()}`;
        };

        const coinData: CoinData = {
            metrics: {
                totalUwaciCoins: {
                    value: totalCoins,
                    label: 'Total Uwaci Coins',
                    formatted: formatNumber(totalCoins)
                },
                coinsEarned: {
                    value: totalCoinsEarned,
                    label: 'Coins Earned',
                    formatted: formatNumber(totalCoinsEarned)
                },
                coinsSpent: {
                    value: totalCoinsSpent,
                    label: 'Coins Spent',
                    formatted: formatNumber(totalCoinsSpent)
                },
                totalDifference: {
                    value: totalDifference,
                    label: 'Total Difference',
                    formatted: formatNumber(totalDifference)
                }
            },
            userMetrics: usersMetrics
        };
        return NextResponse.json(coinData);
    } catch (error) {
        console.error('Error fetching coin data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch coin data' },
            { status: 500 }
        );
    }
}
