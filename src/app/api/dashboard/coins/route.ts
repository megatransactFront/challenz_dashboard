// app/api/dashboard/coins/route.ts
import { NextResponse } from 'next/server';
import { CoinData, CoinTransaction } from '@/app/types/coins';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export async function GET() {
    try {
        // Mock data for demonstration purposes
        // In a real application, this would fetch data from a database or external API
        const mockTransactions: CoinTransaction[] = [
            // Daily Transactions for 2025
            {
                date: '2025-04-14T08:00:00.000000+00:00',
                totalLikes: 120,
                totalReferrals: 215,
                totalShares: 430,
                challengesMade: 960,
                badgesReceived: 3850,
                totalEarned: 5950,
                totalSpent: 95
            },
            {
                date: '2025-04-15T08:00:00.000000+00:00',
                totalLikes: 130,
                totalReferrals: 230,
                totalShares: 440,
                challengesMade: 1000,
                badgesReceived: 3950,
                totalEarned: 6050,
                totalSpent: 105
            },
            {
                date: '2025-04-16T08:00:00.000000+00:00',
                totalLikes: 125,
                totalReferrals: 220,
                totalShares: 435,
                challengesMade: 990,
                badgesReceived: 3900,
                totalEarned: 6000,
                totalSpent: 100
            },

            // Weekly Transactions for 2025
            {
                date: '2025-04-13T08:00:00.000000+00:00',
                totalLikes: 710,
                totalReferrals: 1330,
                totalShares: 2950,
                challengesMade: 6900,
                badgesReceived: 26500,
                totalEarned: 41500,
                totalSpent: 710
            },
            {
                date: '2025-04-06T08:00:00.000000+00:00',
                totalLikes: 700,
                totalReferrals: 1300,
                totalShares: 2900,
                challengesMade: 6800,
                badgesReceived: 26000,
                totalEarned: 41000,
                totalSpent: 700
            },
            {
                date: '2025-03-30T08:00:00.000000+00:00',
                totalLikes: 690,
                totalReferrals: 1320,
                totalShares: 2950,
                challengesMade: 6900,
                badgesReceived: 26200,
                totalEarned: 41300,
                totalSpent: 710
            },

            // Monthly Transactions for 2025
            {
                date: '2025-04-01T08:00:00.000000+00:00',
                totalLikes: 3300,
                totalReferrals: 6100,
                totalShares: 13200,
                challengesMade: 30500,
                badgesReceived: 122000,
                totalEarned: 190000,
                totalSpent: 3300
            },
            {
                date: '2025-03-01T08:00:00.000000+00:00',
                totalLikes: 3200,
                totalReferrals: 6000,
                totalShares: 13000,
                challengesMade: 30000,
                badgesReceived: 120000,
                totalEarned: 185000,
                totalSpent: 3200
            },
            {
                date: '2025-02-01T08:00:00.000000+00:00',
                totalLikes: 3100,
                totalReferrals: 5900,
                totalShares: 12500,
                challengesMade: 29000,
                badgesReceived: 115000,
                totalEarned: 180000,
                totalSpent: 3100
            },
            {
                date: '2025-01-01T08:00:00.000000+00:00',
                totalLikes: 3000,
                totalReferrals: 5800,
                totalShares: 12000,
                challengesMade: 28000,
                badgesReceived: 110000,
                totalEarned: 175000,
                totalSpent: 3000
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
            transactions: mockTransactions
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
