import { apiClient, ApiResponse } from "@/lib/api";

// Map frontend transaction types to backend enum values
const TRANSACTION_TYPE_MAP: Record<string, string> = {
  'income': 'INCOME',
  'expense': 'EXPENSE',
};

// Map frontend transaction categories to backend enum values
const TRANSACTION_CATEGORY_MAP: Record<string, string> = {
  'needs': 'NEEDS',
  'wants': 'WANTS',
  'savings': 'SAVINGS',
};

// Map backend enum values to frontend transaction types
const REVERSE_TRANSACTION_TYPE_MAP: Record<string, string> = {
  'INCOME': 'income',
  'EXPENSE': 'expense',
};

// Map backend enum values to frontend transaction categories
const REVERSE_TRANSACTION_CATEGORY_MAP: Record<string, string> = {
  'NEEDS': 'needs',
  'WANTS': 'wants',
  'SAVINGS': 'savings',
};

export interface CreateTransactionData {
  amount: number;
  category: 'needs' | 'wants' | 'savings';
  type: 'income' | 'expense';
  description: string;
  date?: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  byCategory: {
    needs: number;
    wants: number;
    savings: number;
  };
}

export const transactionService = {
  // Get all transactions
  async getTransactions(): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>(
        '/transactions'
      );
      
      const transactions = response.data.data || [];
      
      // Map backend enums to frontend enums
      const mappedTransactions = transactions.map(transaction => ({
        ...transaction,
        type: REVERSE_TRANSACTION_TYPE_MAP[transaction.type] || transaction.type,
        category: REVERSE_TRANSACTION_CATEGORY_MAP[transaction.category] || transaction.category,
      }));
      
      return mappedTransactions;
    } catch (error: any) {
      if (error.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // Get a single transaction
  async getTransaction(id: string): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(`/transactions/${id}`);
    const transaction = response.data.data;
    return {
      ...transaction,
      type: REVERSE_TRANSACTION_TYPE_MAP[transaction.type] || transaction.type,
      category: REVERSE_TRANSACTION_CATEGORY_MAP[transaction.category] || transaction.category,
    };
  },

  // Create a new transaction
  async createTransaction(data: CreateTransactionData): Promise<any> {
    const backendData = {
      ...data,
      type: TRANSACTION_TYPE_MAP[data.type],
      category: TRANSACTION_CATEGORY_MAP[data.category],
    };
    
    const response = await apiClient.post<ApiResponse<any>>(
      '/transactions',
      backendData
    );
    const transaction = response.data.data;
    return {
      ...transaction,
      type: REVERSE_TRANSACTION_TYPE_MAP[transaction.type] || transaction.type,
      category: REVERSE_TRANSACTION_CATEGORY_MAP[transaction.category] || transaction.category,
    };
  },

  // Update a transaction
  async updateTransaction(id: string, data: Partial<CreateTransactionData>): Promise<any> {
    const backendData: any = { ...data };
    if (data.type) {
      backendData.type = TRANSACTION_TYPE_MAP[data.type];
    }
    if (data.category) {
      backendData.category = TRANSACTION_CATEGORY_MAP[data.category];
    }
    
    const response = await apiClient.put<ApiResponse<any>>(
      `/transactions/${id}`,
      backendData
    );
    const transaction = response.data.data;
    return {
      ...transaction,
      type: REVERSE_TRANSACTION_TYPE_MAP[transaction.type] || transaction.type,
      category: REVERSE_TRANSACTION_CATEGORY_MAP[transaction.category] || transaction.category,
    };
  },

  // Delete a transaction
  async deleteTransaction(id: string): Promise<void> {
    await apiClient.delete(`/transactions/${id}`);
  },

  // Get transaction statistics
  async getTransactionStats(): Promise<TransactionStats> {
    const transactions = await this.getTransactions();
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const byCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, { needs: 0, wants: 0, savings: 0 } as any);
    
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      byCategory,
    };
  },
};