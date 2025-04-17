'use client'
import { CoinMetrics } from '@/app/types'
import { Coins } from 'lucide-react'
import React from 'react'

const CoinsMetrics = ({ metrics }: { metrics: CoinMetrics }) => {
    if (!metrics) return (
        <div className='text-center text-red-500'>
            Error fetching metrics
        </div>
    );

    return (

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-4">
                        <Coins className="h-6 w-6 text-white" />
                    </div>
                    <span>{metrics?.totalUwaciCoins?.label}</span>
                </div>
                <div className="text-3xl font-bold">${metrics?.totalUwaciCoins?.formatted}</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-4">
                        <Coins className="h-6 w-6 text-white" />
                    </div>
                    <span>{metrics?.coinsEarned?.label}</span>
                </div>
                <div className="text-3xl font-bold text-green-500">+{metrics?.coinsEarned?.formatted}</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-4">
                        <Coins className="h-6 w-6 text-white" />
                    </div>
                    <span>{metrics?.coinsSpent?.label}</span>
                </div>
                <div className="text-3xl font-bold text-red-500">-{metrics?.coinsSpent?.formatted}</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-4">
                        <Coins className="h-6 w-6 text-white" />
                    </div>
                    <span>{metrics?.totalDifference?.label}</span>
                </div>
                <div className="text-3xl font-bold text-green-500">{metrics?.totalDifference?.formatted}</div>
            </div>
        </div>
    )
}

export default CoinsMetrics
