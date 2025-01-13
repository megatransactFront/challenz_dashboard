// app/types/challenz.ts
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
  // Additional fields from transformedChallenges
  views?: number;
  usersJoined?: number;
  likes?: number;
  comments?: number;
}

export type ChallengeDetail = Challenge & {
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string | null;
  };
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
  };
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