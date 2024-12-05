"use client"

import React from 'react';
import { Users, Clock, Target, TrendingUp, LucideIcon, TrendingUpDown} from 'lucide-react';
import { StatCard } from '../shared/StatCard';
import { StatCardData2 } from '@/app/types/engagement';

interface EngagementStatsProps {
  stats: StatCardData2[];
}


const iconMap: Record<string, LucideIcon> = {
  "Daily Active Users": Users,
  "Avg. Session Duration": Clock,
  "New Challenges": Target,
  "Challenges Participated": TrendingUp,
  "Best Time To Post": Clock,
  "Hot Categories": TrendingUpDown
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