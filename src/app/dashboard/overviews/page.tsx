"use client"

import React, { useEffect, useState } from 'react';
import { Users, Trophy, DollarSign, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from '../components/shared/StatCard';
import { UserChart } from '../components/overview/UserChart';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types for our API responses
interface DashboardMetrics {
  totalRegistrations: { value: number; label: string; formatted: string };
  newUsers: { value: number; label: string; formatted: string };
  totalChallenges: { value: number; label: string; formatted: string };
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
    // Fetch both metrics and user data simultaneously
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [metricsRes, userDataRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/users')
        ]);

        if (!metricsRes.ok || !userDataRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [metricsData, userData] = await Promise.all([
          metricsRes.json(),
          userDataRes.json()
        ]);

        setMetrics(metricsData);
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
  }, []); // Empty dependency array means this runs once on component mount

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Registrations" 
          value={metrics.totalRegistrations.formatted} 
          icon={Users} 
        />
        <StatCard 
          title="New Users" 
          value={metrics.newUsers.formatted} 
          icon={Users} 
        />
        <StatCard 
          title="Total Challenges" 
          value={metrics.totalChallenges.formatted} 
          icon={Trophy} 
        />
        <StatCard 
          title="Total Revenue" 
          value={metrics.totalRevenue.formatted} 
          icon={DollarSign} 
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