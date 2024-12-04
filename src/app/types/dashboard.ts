// app/types/dashboard.ts
export interface DashboardStats {
  totalRegistrations: {
    value: number;
    label: string;
  };
  newUsers: {
    value: number;
    label: string;
  };
  totalChallenges: {
    value: number;
    label: string;
  };
  totalRevenue: {
    value: number;
    label: string;
  };
}

export interface UserData {
  month: string;
  totalUsers: number;
  newUsers: number;
}