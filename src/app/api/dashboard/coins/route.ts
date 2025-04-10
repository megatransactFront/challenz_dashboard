// app/api/dashboard/coins/route.ts
import { NextResponse } from 'next/server';
import { CoinData, CoinTransaction } from '@/app/types/coins';

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

        const coinData: CoinData = {
            metrics: {
                totalUwaciCoins: {
                    value: 1300000000,
                    label: 'Total Uwaci Coins',
                    formatted: '$1.3 Billion'
                },
                coinsEarned: {
                    value: 700000000,
                    label: 'Coins Earned',
                    formatted: '+700 mil'
                },
                coinsSpent: {
                    value: 650000000,
                    label: 'Coins Spent',
                    formatted: '-650 mil'
                },
                totalDifference: {
                    value: 150000000,
                    label: 'Total Difference',
                    formatted: '+150 mil'
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
