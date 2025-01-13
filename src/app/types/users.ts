// types/users.ts
export type User = {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
  name?: string;
  avatar_url?: string;
  email?: string;
  role?: string;
  last_login?: string;
  is_active: boolean;
}

export type Comment = {
  id: string;
  user_id: string;
  challenge_id: string;
  content: string;
  likes_count: number;
  reports_count: number;
  replies_count: number;
  created_at: string;
}

export type Challenge = {
  id: string;
  title: string;
  creator_id: string;
  description?: string;
  created_at: string;
  expires_at?: string;
  topic?: string;
  voting_enabled?: boolean;
  views_count: number;
  participants_count: number;
  likes_count: number;
  comments_count: number;
  sponsored_by?: string;
  prize_details?: {
    first: string;
    second: string;
    third: string;
  };
}

export type UserResponse = {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}