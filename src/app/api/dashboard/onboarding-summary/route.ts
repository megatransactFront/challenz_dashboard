// src/app/api/dashboard/onboarding-summary/route.ts

import { NextResponse } from 'next/server';
import type { OnboardingSummaryData } from '@/app/types/onboarding-summary';

export const runtime = 'edge';

export async function GET() {
  // Mock data for onboarding summary
  const data: OnboardingSummaryData = {
    cards: {
      newUsers: {
        title: 'New Users',
        metric: {
          value: 1245,
          change: 5.2,
          trend: 'up'
        },
        chartData: [
          { date: 'Apr 15', value: 180 },
          { date: 'Apr 16', value: 195 },
          { date: 'Apr 17', value: 175 },
          { date: 'Apr 18', value: 190 },
          { date: 'Apr 19', value: 210 },
          { date: 'Apr 20', value: 185 },
          { date: 'Apr 21', value: 205 },
          { date: 'Apr 22', value: 215 }
        ]
      },
      newMerchants: {
        title: 'New Merchants',
        metric: {
          value: 342,
          change: -5.6,
          trend: 'down'
        },
        chartData: [
          { date: 'Apr 15', value: 52 },
          { date: 'Apr 16', value: 48 },
          { date: 'Apr 17', value: 45 },
          { date: 'Apr 18', value: 50 },
          { date: 'Apr 19', value: 43 },
          { date: 'Apr 20', value: 47 },
          { date: 'Apr 21', value: 40 },
          { date: 'Apr 22', value: 42 }
        ]
      },
      stage2LoopsClosed: {
        title: 'Stage 2 Loops Closed',
        metric: {
          value: 158,
          change: 12.0,
          trend: 'up'
        },
        chartData: [
          { date: 'Apr 15', value: 22 },
          { date: 'Apr 16', value: 25 },
          { date: 'Apr 17', value: 20 },
          { date: 'Apr 18', value: 23 },
          { date: 'Apr 19', value: 28 },
          { date: 'Apr 20', value: 24 },
          { date: 'Apr 21', value: 26 },
          { date: 'Apr 22', value: 30 }
        ]
      }
    },
    tableData: [
      // Most recent week (Apr 16-22, 2024)
      {
        date: 'Apr 22, 2024',
        country: 'USA',
        countryCode: 'US',
        city: 'New York',
        newUsers: 215,
        newMerchants: 67,
        stage2LoopsClosed: 34
      },
      {
        date: 'Apr 21, 2024',
        country: 'Mexico',
        countryCode: 'MX',
        city: 'Mexico City',
        newUsers: 198,
        newMerchants: 54,
        stage2LoopsClosed: 26
      },
      {
        date: 'Apr 20, 2024',
        country: 'Philippines',
        countryCode: 'PH',
        city: 'Manila',
        newUsers: 179,
        newMerchants: 43,
        stage2LoopsClosed: 29
      },
      {
        date: 'Apr 19, 2024',
        country: 'Japan',
        countryCode: 'JP',
        city: 'Tokyo',
        newUsers: 203,
        newMerchants: 56,
        stage2LoopsClosed: 31
      },
      {
        date: 'Apr 18, 2024',
        country: 'Indonesia',
        countryCode: 'ID',
        city: 'Jakarta',
        newUsers: 203,
        newMerchants: 56,
        stage2LoopsClosed: 28
      },
      {
        date: 'Apr 17, 2024',
        country: 'Brazil',
        countryCode: 'BR',
        city: 'Sao Paulo',
        newUsers: 117,
        newMerchants: 31,
        stage2LoopsClosed: 29
      },
      {
        date: 'Apr 16, 2024',
        country: 'USA',
        countryCode: 'US',
        city: 'Los Angeles',
        newUsers: 145,
        newMerchants: 38,
        stage2LoopsClosed: 21
      },

      // Previous week (Apr 9-15, 2024)
      {
        date: 'Apr 15, 2024',
        country: 'Mexico',
        countryCode: 'MX',
        city: 'Guadalajara',
        newUsers: 167,
        newMerchants: 42,
        stage2LoopsClosed: 24
      },
      {
        date: 'Apr 14, 2024',
        country: 'Philippines',
        countryCode: 'PH',
        city: 'Cebu',
        newUsers: 134,
        newMerchants: 29,
        stage2LoopsClosed: 18
      },
      {
        date: 'Apr 13, 2024',
        country: 'Japan',
        countryCode: 'JP',
        city: 'Osaka',
        newUsers: 189,
        newMerchants: 51,
        stage2LoopsClosed: 27
      },
      {
        date: 'Apr 12, 2024',
        country: 'Indonesia',
        countryCode: 'ID',
        city: 'Surabaya',
        newUsers: 156,
        newMerchants: 37,
        stage2LoopsClosed: 22
      },
      {
        date: 'Apr 11, 2024',
        country: 'Brazil',
        countryCode: 'BR',
        city: 'Rio de Janeiro',
        newUsers: 143,
        newMerchants: 35,
        stage2LoopsClosed: 20
      },
      {
        date: 'Apr 10, 2024',
        country: 'USA',
        countryCode: 'US',
        city: 'Chicago',
        newUsers: 178,
        newMerchants: 45,
        stage2LoopsClosed: 25
      },
      {
        date: 'Apr 9, 2024',
        country: 'Mexico',
        countryCode: 'MX',
        city: 'Monterrey',
        newUsers: 121,
        newMerchants: 28,
        stage2LoopsClosed: 16
      },

      // Third week back (Apr 2-8, 2024)
      {
        date: 'Apr 8, 2024',
        country: 'Philippines',
        countryCode: 'PH',
        city: 'Davao',
        newUsers: 98,
        newMerchants: 22,
        stage2LoopsClosed: 14
      },
      {
        date: 'Apr 7, 2024',
        country: 'Japan',
        countryCode: 'JP',
        city: 'Kyoto',
        newUsers: 156,
        newMerchants: 40,
        stage2LoopsClosed: 23
      },
      {
        date: 'Apr 6, 2024',
        country: 'Indonesia',
        countryCode: 'ID',
        city: 'Bandung',
        newUsers: 134,
        newMerchants: 33,
        stage2LoopsClosed: 19
      },
      {
        date: 'Apr 5, 2024',
        country: 'Brazil',
        countryCode: 'BR',
        city: 'Brasilia',
        newUsers: 112,
        newMerchants: 27,
        stage2LoopsClosed: 17
      },
      {
        date: 'Apr 4, 2024',
        country: 'USA',
        countryCode: 'US',
        city: 'Houston',
        newUsers: 167,
        newMerchants: 42,
        stage2LoopsClosed: 24
      },
      {
        date: 'Apr 3, 2024',
        country: 'Mexico',
        countryCode: 'MX',
        city: 'Puebla',
        newUsers: 145,
        newMerchants: 36,
        stage2LoopsClosed: 21
      },
      {
        date: 'Apr 2, 2024',
        country: 'Philippines',
        countryCode: 'PH',
        city: 'Quezon City',
        newUsers: 123,
        newMerchants: 30,
        stage2LoopsClosed: 18
      },

      // Fourth week back (Mar 26 - Apr 1, 2024)
      {
        date: 'Apr 1, 2024',
        country: 'Japan',
        countryCode: 'JP',
        city: 'Yokohama',
        newUsers: 178,
        newMerchants: 46,
        stage2LoopsClosed: 26
      },
      {
        date: 'Mar 31, 2024',
        country: 'Indonesia',
        countryCode: 'ID',
        city: 'Medan',
        newUsers: 134,
        newMerchants: 32,
        stage2LoopsClosed: 19
      },
      {
        date: 'Mar 30, 2024',
        country: 'Brazil',
        countryCode: 'BR',
        city: 'Salvador',
        newUsers: 109,
        newMerchants: 26,
        stage2LoopsClosed: 15
      },
      {
        date: 'Mar 29, 2024',
        country: 'USA',
        countryCode: 'US',
        city: 'Phoenix',
        newUsers: 156,
        newMerchants: 39,
        stage2LoopsClosed: 22
      },
      {
        date: 'Mar 28, 2024',
        country: 'Mexico',
        countryCode: 'MX',
        city: 'Tijuana',
        newUsers: 132,
        newMerchants: 34,
        stage2LoopsClosed: 20
      },
      {
        date: 'Mar 27, 2024',
        country: 'Philippines',
        countryCode: 'PH',
        city: 'Makati',
        newUsers: 145,
        newMerchants: 37,
        stage2LoopsClosed: 21
      },
      {
        date: 'Mar 26, 2024',
        country: 'Japan',
        countryCode: 'JP',
        city: 'Sapporo',
        newUsers: 167,
        newMerchants: 43,
        stage2LoopsClosed: 24
      }
    ]
  };

  return NextResponse.json(data);
}