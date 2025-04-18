"use client"

import React, { useEffect, useState } from 'react';
import { Users, Trophy, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from '../components/shared/StatCard';
import { UserChart } from '../components/overview/UserChart';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types for our API responses
interface DashboardMetrics {
  totalRegistrations: { value: number; label: string; formatted: string };
  newUsers: { value: number; label: string; formatted: string };
  activeUsers: { value: number; label: string; formatted: string };
  totalRevenue: { value: number; label: string; formatted: string };
}

interface UserData {
  month: string;
  totalUsers: number;
  newUsers: number;
}

export default function Page() {
  // State management
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/dashboard/overview');

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const { stats, userData } = await response.json();

        setMetrics(stats);
        setUserData(userData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Em
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
  if (!metrics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Registrations"
          value={metrics.totalRegistrations.formatted}
          icon={Users}
          change="+12.3% from last month"
          trend="up"
        />
        <StatCard
          title="New users (within 3 days)"
          value={metrics.newUsers.formatted}
          icon={Users}
          change="-5.2% from last week"
          trend="down"
        />
        <StatCard
          title="Active users (4 hours daily)"
          value={metrics.activeUsers.formatted}  // Change this from totalChallenges to activeUsers
          icon={Trophy}
          change="+8.7% this month"
          trend="up"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <UserChart data={userData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}