// app/engagement/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from 'lucide-react';
import  EngagementStats  from '../components/engagements/EngagementStats';
import { EngagementChart } from '../components/engagements/EngagementChart';
import { ActivityLog } from '../components/engagements/ActivityLog';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity, EngagementData, StatCardData } from '@/app/types/engagement';

// API response type
interface EngagementApiResponse {
  chartData: EngagementData[];
  statsData: StatCardData[];
  activities: Activity[];
}

// Initial state values
const initialState = {
  engagementData: [] as EngagementData[],
  statsData: [] as StatCardData[],
  activities: [] as Activity[],
  isLoading: true,
  error: null as string | null
};

export default function EngagementPage() {
  // Use the initial state type to ensure type safety
  const [state, setState] = useState<typeof initialState>(initialState);
  const { engagementData, statsData, activities, isLoading, error } = state;

  useEffect(() => {
    const fetchEngagementData = async () => {
      try {
        const response = await fetch('/api/dashboard/engagement');

        if (!response.ok) {
          throw new Error(`Failed to fetch engagement data: ${response.statusText}`);
        }

        const data = (await response.json()) as EngagementApiResponse;

        // Validate the response data
        if (!Array.isArray(data.chartData) || !Array.isArray(data.statsData) || !Array.isArray(data.activities)) {
          throw new Error('Invalid data format received from API');
        }

        setState(prev => ({
          ...prev,
          engagementData: data.chartData,
          statsData: data.statsData,
          activities: data.activities,
          error: null,
          isLoading: false
        }));
      } catch (err) {
        console.error('Error fetching engagement data:', err);
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'An error occurred while fetching data',
          isLoading: false
        }));
      }
    };

    fetchEngagementData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" aria-label="Loading">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-full bg-gray-50/30 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="pt-8">
          <div className="space-y-8">
            <EngagementStats stats={statsData} />
            <div className="grid gap-6 lg:grid-cols-2">
              <EngagementChart data={engagementData} />
              <ActivityLog activities={activities} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}