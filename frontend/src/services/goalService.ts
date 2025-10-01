import { apiClient, ApiResponse } from '@/lib/api';
import { Goal } from '@/contexts/FinanceContext';

export interface CreateGoalData {
  title: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: string;
}

export interface GoalProgress {
  totalGoals: number;
  completedGoals: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  averageProgress: number;
}

export const goalService = {
  // Get all goals
  async getGoals(): Promise<Goal[]> {
    const response = await apiClient.get<ApiResponse<{ goals: Goal[] }>>(
      '/goals'
    );
    return response.data.data.goals;
  },

  // Get a single goal
  async getGoal(id: string): Promise<Goal> {
    const response = await apiClient.get<ApiResponse<{ goal: Goal }>>(
      `/goals/${id}`
    );
    return response.data.data.goal;
  },

  // Create a new goal
  async createGoal(data: CreateGoalData): Promise<Goal> {
    const response = await apiClient.post<ApiResponse<{ goal: Goal }>>(
      '/goals',
      data
    );
    return response.data.data.goal;
  },

  // Update a goal
  async updateGoal(id: string, data: Partial<CreateGoalData>): Promise<Goal> {
    const response = await apiClient.put<ApiResponse<{ goal: Goal }>>(
      `/goals/${id}`,
      data
    );
    return response.data.data.goal;
  },

  // Delete a goal
  async deleteGoal(id: string): Promise<void> {
    await apiClient.delete(`/goals/${id}`);
  },

  // Get goal progress summary
  async getGoalProgress(): Promise<GoalProgress> {
    const response = await apiClient.get<ApiResponse<GoalProgress>>(
      '/goals/progress'
    );
    return response.data.data;
  },
};

