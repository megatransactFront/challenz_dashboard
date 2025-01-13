// types/challenge.ts
export type Challenge = {
    id: string;
    creator_id: string;
    title: string;
    description: string;
    category: string;
    is_seasonal: boolean;
    is_sponsored: boolean;
    created_at: string;
    updated_at: string;
    duet_video_url: string | null;
    user_id: string;
    video_url: string;
    submission_id: string | null;
    joined_at: string | null;
    inspired_by_id: string | null;
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