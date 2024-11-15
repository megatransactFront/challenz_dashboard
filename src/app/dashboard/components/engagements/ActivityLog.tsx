"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Share2, Heart, Send, UserPlus } from 'lucide-react';
import { ActivityLog as ActivityLogType } from './types';

interface ActivityLogProps {
  activities?: ActivityLogType[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'comment':
      return <MessageSquare className="w-4 h-4 text-blue-500" />;
    case 'share':
      return <Share2 className="w-4 h-4 text-green-500" />;
    case 'like':
      return <Heart className="w-4 h-4 text-red-500" />;
    case 'post':
      return <Send className="w-4 h-4 text-purple-500" />;
    case 'follow':
      return <UserPlus className="w-4 h-4 text-yellow-500" />;
    default:
      return null;
  }
};

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities = [] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-gray-50"
            >
              <div className="p-2 bg-white rounded-full shadow-sm">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{' '}
                  {activity.action}{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No recent activity</p>
        )}
      </div>
    </CardContent>
  </Card>
);