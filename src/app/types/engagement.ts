// app/types/engagement.ts
import { LucideIcon } from "lucide-react";

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

export interface StatCardData2 {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}