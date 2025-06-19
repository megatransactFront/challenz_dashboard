// app/api/dashboard/coins/route.ts
import { CoinData } from '@/app/types/coins';

import { NextResponse } from 'next/server';
import { fetchCoinSystemSummaryData, fetchUsersAndCoinData } from './coinControllers';
import { countTotalUsers } from './coinDbAccess';
import { coinErrorHandle } from './errorHandle';
import { formatNumber } from './helpers';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const totalUsers = await countTotalUsers()
        const usersData = await fetchUsersAndCoinData(page, limit);

        const { totalEarned: totalCoinsEarned, totalSpent: totalCoinsSpent } = await fetchCoinSystemSummaryData();

        const coinData: CoinData = {
            metrics: {
                totalUwaciCoins: {
                    value: totalCoinsEarned - totalCoinsSpent,
                    label: 'Total Uwaci Coins',
                    formatted: formatNumber(totalCoinsEarned - totalCoinsSpent)
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
                }
            },
            userMetrics: usersData,
            totalUsersPage: Math.ceil((totalUsers || 0) / limit)
        };
        return NextResponse.json(coinData);
    } catch (error) {
        coinErrorHandle(error as Error)
    }
}
