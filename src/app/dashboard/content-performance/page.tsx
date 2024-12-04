"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import ContentPerformanceTables from '@/app/dashboard/components/content-performance/ContentPerformanceTables';
import type { Post, Category } from '@/app/types/content-performance';

// API response type
interface ContentPerformanceApiResponse {
  topPosts: Post[];
  topCategories: Category[];
}

// Initial state values
const initialState = {
  topPosts: [] as Post[],
  topCategories: [] as Category[],
  isLoading: true,
  error: null as string | null
};

export default function ContentPerformancePage() {
  const [state, setState] = useState<typeof initialState>(initialState);
  const { topPosts, topCategories, isLoading, error } = state;

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const response = await fetch('/api/dashboard/content-performance');

        if (!response.ok) {
          throw new Error(`Failed to fetch content performance data: ${response.statusText}`);
        }

        const data = (await response.json()) as ContentPerformanceApiResponse;

        if (!Array.isArray(data.topPosts) || !Array.isArray(data.topCategories)) {
          throw new Error('Invalid data format received from API');
        }

        setState(prev => ({
          ...prev,
          topPosts: data.topPosts,
          topCategories: data.topCategories,
          error: null,
          isLoading: false
        }));
      } catch (err) {
        console.error('Error fetching content performance data:', err);
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'An error occurred while fetching data',
          isLoading: false
        }));
      }
    };

    fetchContentData();
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
          <ContentPerformanceTables 
            topPosts={topPosts}
            topCategories={topCategories}
          />
        </div>
      </div>
    </div>
  );
}