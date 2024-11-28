import React from 'react';
import { LucideIcon } from 'lucide-react';
import { StatCard } from '../shared/StatCard';

interface StatCardData {
  title: string;
  value: string;
  icon: LucideIcon;
}

interface RevenueStatsProps {
  stats: StatCardData[];
}

export const RevenueStats: React.FC<RevenueStatsProps> = ({ stats }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {stats.map((stat, index) => (
      <StatCard 
        key={index}
        title={stat.title}
        value={stat.value}
        icon={stat.icon}
      />
    ))}
  </div>
);