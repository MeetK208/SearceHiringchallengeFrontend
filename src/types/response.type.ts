interface BaseResponse {
  status: 'success' | 'error';
  message: string;
}

export type ApiResponse<K extends string, T> = BaseResponse & {
  [key in K]?: T;
};

export interface User {
  email: string;
  userId: number;
  role: string;
}

export interface GetUser {
  userId: number;
  username: string;
  email: string;
}

export interface UserCard {
  carduserId: number;
  designation: string;
  department: string;
  budget: string;
  location: string;
  last_updated_timestamp: string;
  projectCard: number;
  last_edited_by_userId: number;
  last_edited_by_username: string;
}

export interface DashboardMatrix {
  department: string;
  rupeese: number;
  percentage_used: number;
}

export interface Results {
  status: string;
  message: string;
  userId: string;
  email: string;
  projectId: string;
  projectName: string;
  userCards: UserCard[];
  DashboardMatrix: DashboardMatrix[];
  totalBudget: string;
  usedBudget: string;
  total_pages: number;
  total_records: number;
}

export interface ApiResponse2 {
  count: number;
  next: string | null;
  previous: string | null;
  results: Results;
}
