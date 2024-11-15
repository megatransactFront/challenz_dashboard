export interface EngagementData {
    hour: string;
    activeUsers: number;
    engagement: number;
  }
  
  export interface ActivityLog {
    id: string;
    user: string;
    action: string;
    target: string;
    timestamp: string;
    type: 'comment' | 'like' | 'share' | 'post' | 'follow';
  }