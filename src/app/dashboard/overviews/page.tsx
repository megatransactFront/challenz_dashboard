"use client"

import React, { useEffect, useState } from 'react';
import { Users, Trophy, DollarSign, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from '../components/shared/StatCard';
import { UserChart } from '../components/overview/UserChart';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types matching your API responses
interface Stats {
  totalRegistrations: { value: number; label: string };
  newUsers: { value: number; label: string };
  totalChallenges: { value: number; label: string };
  totalRevenue: { value: number; label: string };
}

interface UserData {
  month: string;
  totalUsers: number;
  newUsers: number;
}

export default function Page() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, userDataRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/users')
        ]);

        if (!statsRes.ok || !userDataRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [statsData, userData] = await Promise.all([
          statsRes.json(),
          userDataRes.json()
        ]);

        setStats(statsData);
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
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!stats) {
    return null;
  }

  // Format values for display
  const formatValue = (value: number, label: string) => {
    if (label === 'USD') {
      return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${value.toLocaleString()}${label ? ` ${label}` : ''}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Registrations" 
          value={formatValue(stats.totalRegistrations.value, stats.totalRegistrations.label)} 
          icon={Users} 
        />
        <StatCard 
          title="New Users" 
          value={formatValue(stats.newUsers.value, stats.newUsers.label)} 
          icon={Users} 
        />
        <StatCard 
          title="Total Challenges" 
          value={formatValue(stats.totalChallenges.value, stats.totalChallenges.label)} 
          icon={Trophy} 
        />
        <StatCard 
          title="Total Revenue" 
          value={formatValue(stats.totalRevenue.value, stats.totalRevenue.label)} 
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