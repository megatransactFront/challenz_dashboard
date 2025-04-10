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
                date: '30/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 500,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '29/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 500,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '28/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 500,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '27/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 500,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '26/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '25/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '24/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '23/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '24/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '23/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '24/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '23/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '24/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '23/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '24/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '23/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '24/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '23/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '24/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '23/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '24/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '23/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '24/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
            },
            {
                date: '23/04/2024',
                totalLikes: 100,
                totalReferrals: 250,
                totalShares: 100,
                challengesMade: 1250,
                badgesReceived: 5000,
                totalEarned: 7100,
                totalSpent: 100
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
