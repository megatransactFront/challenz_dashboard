import { ActivityLog, EngagementData } from "./types";

export const mockEngagementData: EngagementData[] = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    activeUsers: Math.floor(Math.random() * 1000) + 200,
    engagement: Math.floor(Math.random() * 80) + 20,
  }));
  
  export const mockActivityLogs: ActivityLog[] = [
    {
      id: '1',
      user: 'John Smith',
      action: 'commented on',
      target: 'Ice Bucket Challenge',
      timestamp: '2024-03-15T14:30:00',
      type: 'comment'
    },
    {
      id: '2',
      user: 'Emma Wilson',
      action: 'shared',
      target: 'Dance Challenge',
      timestamp: '2024-03-15T14:25:00',
      type: 'share'
    },
    {
      id: '3',
      user: 'Michael Brown',
      action: 'liked',
      target: 'Fitness Challenge',
      timestamp: '2024-03-15T14:20:00',
      type: 'like'
    },
    // Add more mock data as needed
  ];