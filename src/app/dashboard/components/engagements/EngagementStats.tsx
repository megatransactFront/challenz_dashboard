"use client"

import React from 'react';
import { Users, Clock, Target, TrendingUp } from 'lucide-react';
import { StatCard } from '../shared/StatCard';

export const EngagementStats = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <StatCard 
      title="Daily Active Users" 
      value="8,249" 
      icon={Users} 
    />
    <StatCard 
      title="Avg. Session Duration" 
      value="12m 30s" 
      icon={Clock} 
    />
    <StatCard 
      title="Engagement Rate" 
      value="68.7%" 
      icon={Target} 
    />
    <StatCard 
      title="Growth Rate" 
      value="+12.3%" 
      icon={TrendingUp} 
    />
  </div>
);