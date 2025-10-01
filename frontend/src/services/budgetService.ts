import { apiClient, ApiResponse } from '@/lib/api';
import { BudgetRule, BudgetAllocation } from '@/contexts/FinanceContext';

export interface Budget {
  id: string;
  userId: string;
  rule: BudgetRule;
  customAllocation?: BudgetAllocation;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetData {
  rule: BudgetRule;
  customAllocation?: BudgetAllocation;
}

export interface BudgetSummary {
  budget: Budget;
  spent: {
    needs: number;
    wants: number;
    savings: number;
  };
  remaining: {
    needs: number;
    wants: number;
    savings: number;
  };
  allocation: BudgetAllocation;
}

export const budgetService = {
  // Get current budget
  async getBudget(): Promise<Budget | null> {
    try {
      const response = await apiClient.get<ApiResponse<{ budget: Budget }>>(
        '/budget'
      );
      return response.data.data.budget;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create a new budget
  async createBudget(data: CreateBudgetData): Promise<Budget> {
    const response = await apiClient.post<ApiResponse<{ budget: Budget }>>(
      '/budget',
      data
    );
    return response.data.data.budget;
  },

  // Update budget
  async updateBudget(data: Partial<CreateBudgetData>): Promise<Budget> {
    const response = await apiClient.put<ApiResponse<{ budget: Budget }>>(
      '/budget',
      data
    );
    return response.data.data.budget;
  },

  // Delete budget
  async deleteBudget(): Promise<void> {
    await apiClient.delete('/budget');
  },

  // Get budget summary with spending
  async getBudgetSummary(): Promise<BudgetSummary> {
    const response = await apiClient.get<ApiResponse<BudgetSummary>>(
      '/budget/summary'
    );
    return response.data.data;
  },
};

