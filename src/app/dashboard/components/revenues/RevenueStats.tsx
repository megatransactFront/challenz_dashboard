import React from 'react';
import { LucideIcon } from 'lucide-react';
import { StatCard } from '../shared/StatCard';

interface StatCardData2 {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

interface RevenueStatsProps {
  stats: StatCardData2[];
}

export const RevenueStats: React.FC<RevenueStatsProps> = ({ stats }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {stats.map((stat, index) => (
      <StatCard 
        key={index}
        title={stat.title}
        value={stat.value}
        icon={stat.icon}
        change={stat.change}
        trend={stat.trend}
      />
    ))}
  </div>
);