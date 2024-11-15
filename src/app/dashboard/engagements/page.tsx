"use client"

import React from 'react';
import { EngagementStats } from '../components/engagements/EngagementStats';
import { EngagementChart } from '../components/engagements/EngagementChart';
import { ActivityLog } from '../components/engagements/ActivityLog';
import { mockEngagementData, mockActivityLogs } from '../components/engagements/mock-data';

export default function EngagementPage() {
  return (
    <div className="space-y-6">
      <EngagementStats />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <EngagementChart data={mockEngagementData} />
        <ActivityLog activities={mockActivityLogs} />
      </div>
    </div>
  );
}

