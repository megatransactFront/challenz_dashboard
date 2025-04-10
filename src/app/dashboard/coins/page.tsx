// app/dashboard/coins/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Coins, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CoinData } from '@/app/types/coins';

export default function CoinsPage() {
    // State management
    const [coinData, setCoinData] = useState<CoinData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#1F5C71] flex items-center justify-center mr-4">
                            <Coins className="h-6 w-6 text-white" />
                        </div>
                        <span>Total Uwaci Coins</span>
                    </div>
                    <div className="text-3xl font-bold">$1.3 Billion</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#1F5C71] flex items-center justify-center mr-4">
                            <Coins className="h-6 w-6 text-white" />
                        </div>
                        <span>Coins Earned</span>
                    </div>
                    <div className="text-3xl font-bold text-green-500">+700 mil</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#1F5C71] flex items-center justify-center mr-4">
                            <Coins className="h-6 w-6 text-white" />
                        </div>
                        <span>Coins Spent</span>
                    </div>
                    <div className="text-3xl font-bold text-red-500">-650 mil</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#1F5C71] flex items-center justify-center mr-4">
                            <Coins className="h-6 w-6 text-white" />
                        </div>
                        <span>Total Difference</span>
                    </div>
                    <div className="text-3xl font-bold text-green-500">+150 mil</div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Uwaci Coins</h2>
                    <select className="border rounded-md p-2 min-w-[150px]">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="py-3 px-4 text-left">DATE</th>
                                <th className="py-3 px-4 text-left">TOTAL LIKES</th>
                                <th className="py-3 px-4 text-left">TOTAL REFERRALS</th>
                                <th className="py-3 px-4 text-left">TOTAL SHARES</th>
                                <th className="py-3 px-4 text-left">CHALLENGES MADE</th>
                                <th className="py-3 px-4 text-left">BADGES RECEIVED</th>
                                <th className="py-3 px-4 text-left bg-green-50">TOTAL EARNED</th>
                                <th className="py-3 px-4 text-left bg-red-50">TOTAL SPENT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coinData.transactions
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((transaction, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-3 px-4">{transaction.date}</td>
                                        <td className="py-3 px-4">${transaction.totalLikes}</td>
                                        <td className="py-3 px-4">${transaction.totalReferrals}</td>
                                        <td className="py-3 px-4">${transaction.totalShares}</td>
                                        <td className="py-3 px-4">${transaction.challengesMade}</td>
                                        <td className="py-3 px-4">${transaction.badgesReceived}</td>
                                        <td className="py-3 px-4 text-green-600 font-medium">+${transaction.totalEarned}</td>
                                        <td className="py-3 px-4 text-red-600 font-medium">-${transaction.totalSpent}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: Math.ceil(coinData.transactions.length / itemsPerPage) }, (_, i) => i + 1)
                            .map(page => (
                                <button
                                    key={page}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg ${currentPage === page
                                        ? 'bg-[#1F5C71] text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                    </div>
                    <button
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(coinData.transactions.length / itemsPerPage)))}
                        disabled={currentPage === Math.ceil(coinData.transactions.length / itemsPerPage)}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-center mt-8">
                <button className="px-6 py-3 bg-[#E05D5D] text-white rounded-lg uppercase font-medium">
                    Prospering Together
                </button>
            </div>
        </div>
    );
}
