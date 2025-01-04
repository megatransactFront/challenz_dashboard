import React from 'react';
import { Play, Heart, MessageCircle, Share2, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const KPIMetric = ({ icon: Icon, label, value }) => {
  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <div className="bg-teal-700 p-2 rounded-full">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-sm text-gray-600">{label}</h3>
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Card>
  );
};

const KPIDashboard = () => {
  const engagementMetrics = [
    { icon: Play, label: 'Total Posts', value: '120 Posts' },
    { icon: Heart, label: 'Total Likes', value: '300 Likes' },
    { icon: MessageCircle, label: 'Total Comments', value: '50 Comments' },
    { icon: Share2, label: 'Total Shares', value: '12 Shares' }
  ];

  const followerMetrics = [
    { icon: Users, label: 'Total Followers', value: '2,500' },
    { icon: Users, label: 'New Followers (Week)', value: '350 (Week)' },
    { icon: Users, label: 'New Followers (Month)', value: '500 (Month)' },
    { icon: Users, label: 'Unfollow Rates', value: '2% Total' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Master Dashboard</h1>
        <div className="flex space-x-4 mb-6">
          <button className="px-4 py-2 rounded-full bg-gray-100">Challenges</button>
          <button className="px-4 py-2 rounded-full bg-gray-100">Profile Details</button>
          <button className="px-4 py-2 rounded-full bg-gray-100">Badges</button>
          <button className="px-4 py-2 rounded-full bg-teal-700 text-white">KPIs</button>
        </div>
        <h2 className="text-xl font-semibold mb-6">James Thoi Key Performance Indicators</h2>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {engagementMetrics.map((metric, index) => (
            <KPIMetric key={index} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {followerMetrics.map((metric, index) => (
            <KPIMetric key={index} {...metric} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;