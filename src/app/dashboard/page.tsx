// app/dashboard/page.tsx
"use client"

import React from 'react';
import { usePathname } from 'next/navigation';
import { OverviewTab } from './components/overview/page';
import  RevenuePage  from './revenues/page';
import  EngagementPage  from './engagements/page';

export default function Dashboard() {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return { title: 'Overview Dashboard', description: 'View your overview metrics' };
      case '/dashboard/revenues':
        return { title: 'Revenue Analytics', description: 'Track your revenue metrics' };
      case '/dashboard/engagement':
        return { title: 'Engagement Metrics', description: 'Monitor user engagement' };
      case '/dashboard/performance':
        return { title: 'Content Performance', description: 'Analyze content metrics' };
      default:
        return { title: 'Overview Dashboard', description: 'View your overview metrics' };
    }
  };

  const renderContent = () => {
    switch (pathname) {
      case '/dashboard':
        return <OverviewTab />
      case '/dashboard/revenues':
        return <RevenuePage />;
      case '/dashboard/engagements':
        return <EngagementPage />;
      // case '/dashboard/performance':
      //   return <ContentPerformancePage />;
      default:
        return <OverviewTab />;
    }
  };

  const { title, description } = getPageTitle();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-500">{description}</p>
      </div>

      <div className="py-4">
        {renderContent()}
      </div>
    </div>
  );
}