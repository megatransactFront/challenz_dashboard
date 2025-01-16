// app/types/challenz.ts
export type User = {
  id: string;
  username: string;
  last_name: string;
  first_name: string;
  profile_picture_url: string | null;
}

export type Challenge = {
  id: string;
  creator_id: string | null;
  title: string;
  description: string;
  category: string | null;
  is_seasonal: boolean;
  is_sponsored: boolean;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  video_url: string;
  duet_video_url: string | null;
  submission_id: string | null;
  joined_at: string | null;
  inspired_by_id: string | null;
  // From the join query
  creator?: User;
  // Additional metrics
  views?: number;
  usersJoined?: number;
  likes?: number;
  comments?: number;
}

export type DashboardData = {
  challenges: Challenge[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}