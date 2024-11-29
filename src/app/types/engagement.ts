// app/types/engagement.ts

export interface Activity {
    id: string;
    user: string;
    action: string;
    target: string;
    date: string;
    type: 'comment' | 'share' | 'like' | 'post' | 'follow';
    status: 'completed' | 'pending' | 'failed';
  }
  
export interface EngagementData {
    date: string;
    activeUsers: number;
    sessionDuration: number;
    bounceRate: number;
    engagement: number;
  }
  
  export interface StatCardData {
    title: string;
    value: string;
    change: string;  // Fixed spelling
    trend: 'up' | 'down' | 'neutral';
    icon?: React.ElementType;
  }
  
