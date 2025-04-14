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
            {
                date: '2025-03-10T06:58:50.850000+00:00',
                totalLikes: 120,
                totalReferrals: 210,
                totalShares: 430,
                challengesMade: 980,
                badgesReceived: 4000,
                totalEarned: 5740,
                totalSpent: 80
            },
            {
                date: '2024-12-15T08:45:30.123000+00:00',
                totalLikes: 95,
                totalReferrals: 190,
                totalShares: 310,
                challengesMade: 760,
                badgesReceived: 3500,
                totalEarned: 4855,
                totalSpent: 120
            },
            {
                date: '2023-11-05T14:22:10.987000+00:00',
                totalLikes: 180,
                totalReferrals: 275,
                totalShares: 540,
                challengesMade: 1340,
                badgesReceived: 6000,
                totalEarned: 8335,
                totalSpent: 200
            },
            {
                date: '2022-08-20T09:11:40.456000+00:00',
                totalLikes: 75,
                totalReferrals: 100,
                totalShares: 220,
                challengesMade: 500,
                badgesReceived: 2000,
                totalEarned: 2895,
                totalSpent: 50
            },
            {
                date: '2021-06-25T17:33:25.789000+00:00',
                totalLikes: 130,
                totalReferrals: 300,
                totalShares: 480,
                challengesMade: 1100,
                badgesReceived: 5200,
                totalEarned: 7210,
                totalSpent: 90
            },
            {
                date: '2020-10-14T11:10:10.111000+00:00',
                totalLikes: 105,
                totalReferrals: 160,
                totalShares: 390,
                challengesMade: 870,
                badgesReceived: 3900,
                totalEarned: 5525,
                totalSpent: 70
            },
            {
                date: '2019-04-30T13:05:50.321000+00:00',
                totalLikes: 85,
                totalReferrals: 130,
                totalShares: 350,
                challengesMade: 690,
                badgesReceived: 3300,
                totalEarned: 4555,
                totalSpent: 60
            },
            {
                date: '2018-07-12T06:29:20.654000+00:00',
                totalLikes: 140,
                totalReferrals: 240,
                totalShares: 510,
                challengesMade: 1230,
                badgesReceived: 5600,
                totalEarned: 7720,
                totalSpent: 110
            },
            {
                date: '2017-01-09T19:45:55.200000+00:00',
                totalLikes: 100,
                totalReferrals: 180,
                totalShares: 400,
                challengesMade: 950,
                badgesReceived: 4100,
                totalEarned: 5730,
                totalSpent: 85
            },
            {
                date: '2016-05-01T04:20:30.999000+00:00',
                totalLikes: 70,
                totalReferrals: 90,
                totalShares: 290,
                challengesMade: 620,
                badgesReceived: 2500,
                totalEarned: 3570,
                totalSpent: 40
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
