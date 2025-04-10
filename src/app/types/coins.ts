// app/types/coins.ts

export interface CoinTransaction {
    date: string;
    totalLikes: number;
    totalReferrals: number;
    totalShares: number;
    challengesMade: number;
    badgesReceived: number;
    totalEarned: number;
    totalSpent: number;
}

export interface CoinMetrics {
    totalUwaciCoins: { value: number; label: string; formatted: string };
    coinsEarned: { value: number; label: string; formatted: string };
    coinsSpent: { value: number; label: string; formatted: string };
    totalDifference: { value: number; label: string; formatted: string };
}

export interface CoinData {
    metrics: CoinMetrics;
    transactions: CoinTransaction[];
}
