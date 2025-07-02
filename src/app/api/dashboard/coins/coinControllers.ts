import { CoinSystemSummary, CoinTransaction, CoinUserSummary, UserMetrics } from '@/app/types';
import { fetchSystemCoinTransactionsData, fetchUserCoinTransactionsData, fetchUsersData } from './coinDbAccess';
import { isToday } from './helpers';

export const fetchUsersAndCoinData = async (page: number, limit: number, keyword: string): Promise<UserMetrics[]> => {
    const users = await fetchUsersData(page, limit, keyword);
    return Promise.all(users.map(async (user) => {
        const coinTransactions = await fetchUserCoinTransactionsData(user.id);

        const {
            totalEarned,
            totalEarnedToday,
            totalSpent,
            totalSpentToday,
            balance
        } = calculateUserCoinSummary(coinTransactions);

        return {
            userId: user.id,
            name: user.username,
            uwcEarnedTotal: parseFloat(totalEarned.toFixed(3)),
            uwcEarnedToday: parseFloat(totalEarnedToday.toFixed(3)),
            uwcSpentTotal: parseFloat(totalSpent.toFixed(3)),
            uwcSpentToday: parseFloat(totalSpentToday.toFixed(3)),
            uwcBalance: parseFloat(balance.toFixed(3))
        };
    }))
}

export function calculateUserCoinSummary(transactions: CoinTransaction[]): CoinUserSummary {

    return transactions.reduce((acc, tx) => {
        const checkIsToday = isToday(new Date(tx.created_at))

        if (tx.type === 'credit') {
            acc.totalSpent += tx.amount;
            if (checkIsToday) {
                acc.totalSpentToday += tx.amount
            };
            acc.balance -= tx.amount;
        } else if (tx.type === 'debit') {
            acc.totalEarned += tx.amount;
            if (checkIsToday) {
                acc.totalEarnedToday += tx.amount
            };
            acc.balance += tx.amount;
        }

        return acc;
    }, {
        totalSpent: 0,
        totalEarned: 0,
        totalSpentToday: 0,
        totalEarnedToday: 0,
        balance: 0,
    });
}

export function calculateSystemCoinSummary(transactions: CoinTransaction[]): CoinSystemSummary {
    return transactions.reduce((acc, tx) => {
        if (tx.type === 'credit') {
            acc.totalSpent += tx.amount;
        } else if (tx.type === 'debit') {
            acc.totalEarned += tx.amount;
        }

        return acc;
    }, {
        totalSpent: 0,
        totalEarned: 0,
    });
}

export const fetchCoinSystemSummaryData = async (): Promise<CoinSystemSummary> => {
    const coinTransactions = await fetchSystemCoinTransactionsData();

    return calculateSystemCoinSummary(coinTransactions);
}


