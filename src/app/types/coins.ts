// app/types/coins.ts

export interface UserMetrics {
    userId: string,
    name: string,
    uwcEarnedToday: number,
    uwcEarnedTotal: number,
    uwcSpentToday: number,
    uwcSpentTotal: number,
    uwcBalance: number
}

export interface CoinMetrics {
    totalUwaciCoins: { value: number; label: string; formatted: string };
    coinsEarned: { value: number; label: string; formatted: string };
    coinsSpent: { value: number; label: string; formatted: string };
}

export interface CoinData {
    metrics: CoinMetrics;
    userMetrics: UserMetrics[];
    totalUsersPage: number
}

export type CoinUserSummary = {
    totalSpent: number;
    totalEarned: number;
    totalSpentToday: number;
    totalEarnedToday: number;
    balance: number;
}

export type CoinSystemSummary = {
    totalSpent: number;
    totalEarned: number;
}

export type CoinTransaction = {
    amount: number;
    type: 'credit' | 'debit';
    created_at: string;
}
