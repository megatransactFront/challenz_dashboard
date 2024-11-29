"use client"

import React from 'react';
import { Users, Clock, Target, TrendingUp, LucideIcon } from 'lucide-react';
import { StatCard } from '../shared/StatCard';
import { StatCardData } from '@/app/types/engagement';

interface EngagementStatsProps {
  stats: StatCardData[];
}


const iconMap: Record<string, LucideIcon> = {
  "Daily Active Users": Users,
  "Avg. Session Duration": Clock,
  "Engagement Rate": Target,
  "Growth Rate": TrendingUp
};

const EngagementStats: React.FC<EngagementStatsProps> = ({ stats }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {stats.map((stat, index) => {
      const IconComponent = iconMap[stat.title];
      return (
        <StatCard 
          key={index}
          title={stat.title}
          value={stat.value}
          icon={IconComponent}
          change={stat.change}    // Added this
          trend={stat.trend}      // Added this
        />
      );
    })}
  </div>
);

export default EngagementStats;  // Changed to default export