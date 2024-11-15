// app/dashboard/components/overview/page.tsx
import React from 'react';
import { Users, Trophy, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from '../components/shared/StatCard';
import { UserChart } from '../components/overview/UserChart';

const mockUserData = [
  { month: 'Jan', totalUsers: 8000, newUsers: 2000 },
  { month: 'Feb', totalUsers: 7000, newUsers: 1500 },
];

export const OverviewTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Registrations" value="1,125 Users" icon={Users} />
        <StatCard title="New Users" value="154 Users" icon={Users} />
        <StatCard title="Total Challenges" value="7,560" icon={Trophy} />
        <StatCard title="Total Revenue" value="$10,450.00" icon={DollarSign} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <UserChart data={mockUserData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;