import { apiClient, ApiResponse } from "@/lib/api";

// Map frontend budget rules to backend enum values
const BUDGET_RULE_MAP: Record<string, string> = {
  '50/30/20': 'FIFTY_THIRTY_TWENTY',
  '60/20/20': 'SIXTY_TWENTY_TWENTY',
  '70/20/10': 'SEVENTY_TWENTY_TEN',
  'custom': 'CUSTOM',
};

// Map backend enum values to frontend budget rules
const REVERSE_BUDGET_RULE_MAP: Record<string, string> = {
  'FIFTY_THIRTY_TWENTY': '50/30/20',
  'SIXTY_TWENTY_TWENTY': '60/20/20',
  'SEVENTY_TWENTY_TEN': '70/20/10',
  'CUSTOM': 'custom',
};

export type BudgetRule = '50/30/20' | '60/20/20' | '70/20/10' | 'custom';

export interface CreateBudgetData {
  rule: BudgetRule;
  customAllocation?: {
    needs: number;
    wants: number;
    savings: number;
  };
}

export interface Budget {
  id: string;
  rule: BudgetRule;
  customAllocation?: {
    needs: number;
    wants: number;
    savings: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Helper function to safely map backend rule to frontend rule
const mapBackendRuleToFrontend = (backendRule: string): BudgetRule => {
  const mapped = REVERSE_BUDGET_RULE_MAP[backendRule];
  if (mapped && ['50/30/20', '60/20/20', '70/20/10', 'custom'].includes(mapped)) {
    return mapped as BudgetRule;
  }
  return '50/30/20'; // Default fallback
};

export const budgetService = {
  // Get budget
  async getBudget(): Promise<Budget | null> {
    try {
      const response = await apiClient.get<ApiResponse<Budget>>('/budget');
      const budget = response.data.data;
      
      if (!budget) {
        return null;
      }
      
      return {
        ...budget,
        rule: mapBackendRuleToFrontend(budget.rule),
      };
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create or update budget (handles both cases)
  async createOrUpdateBudget(data: CreateBudgetData): Promise<Budget> {
    // Map frontend enum to backend enum
    const backendData = {
      ...data,
      rule: BUDGET_RULE_MAP[data.rule],
    };
    
    // First, check if a budget already exists
    const existingBudget = await this.getBudget();
    
    if (existingBudget) {
      // Budget exists, update it
      console.log('Budget exists, updating...');
      const response = await apiClient.put<ApiResponse<Budget>>(
        '/budget',
        backendData
      );
      
      const budget = response.data.data;
      return {
        ...budget,
        rule: mapBackendRuleToFrontend(budget.rule),
      };
    } else {
      // No budget exists, create a new one
      console.log('No budget exists, creating new one...');
      const response = await apiClient.post<ApiResponse<Budget>>(
        '/budget',
        backendData
      );
      
      const budget = response.data.data;
      return {
        ...budget,
        rule: mapBackendRuleToFrontend(budget.rule),
      };
    }
  },

  // Create budget
  async createBudget(data: CreateBudgetData): Promise<Budget> {
    // Map frontend enum to backend enum
    const backendData = {
      ...data,
      rule: BUDGET_RULE_MAP[data.rule],
    };
    
    const response = await apiClient.post<ApiResponse<Budget>>(
      '/budget',
      backendData
    );
    
    const budget = response.data.data;
    return {
      ...budget,
      rule: mapBackendRuleToFrontend(budget.rule),
    };
  },

  // Update budget
  async updateBudget(data: Partial<CreateBudgetData>): Promise<Budget> {
    // Map frontend enum to backend enum if rule is provided
    const backendData = {
      ...data,
      ...(data.rule && { rule: BUDGET_RULE_MAP[data.rule] }),
    };
    
    const response = await apiClient.put<ApiResponse<Budget>>(
      '/budget',
      backendData
    );
    
    const budget = response.data.data;
    return {
      ...budget,
      rule: mapBackendRuleToFrontend(budget.rule),
    };
  },

  // Delete budget
  async deleteBudget(): Promise<void> {
    await apiClient.delete('/budget');
  },

  // Get budget summary
  async getBudgetSummary(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/budget/summary');
    return response.data.data;
  },
};