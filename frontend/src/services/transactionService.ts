import { apiClient, ApiResponse } from '@/lib/api';
import { Transaction } from '@/contexts/FinanceContext';

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
  async getTransactions(): Promise<Transaction[]> {
    const response = await apiClient.get<ApiResponse<{ transactions: Transaction[] }>>(
      '/transactions'
    );
    return response.data.data.transactions;
  },

  // Get a single transaction
  async getTransaction(id: string): Promise<Transaction> {
    const response = await apiClient.get<ApiResponse<{ transaction: Transaction }>>(
      `/transactions/${id}`
    );
    return response.data.data.transaction;
  },

  // Create a new transaction
  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    const response = await apiClient.post<ApiResponse<{ transaction: Transaction }>>(
      '/transactions',
      data
    );
    return response.data.data.transaction;
  },

  // Update a transaction
  async updateTransaction(
    id: string,
    data: Partial<CreateTransactionData>
  ): Promise<Transaction> {
    const response = await apiClient.put<ApiResponse<{ transaction: Transaction }>>(
      `/transactions/${id}`,
      data
    );
    return response.data.data.transaction;
  },

  // Delete a transaction
  async deleteTransaction(id: string): Promise<void> {
    await apiClient.delete(`/transactions/${id}`);
  },

  // Get transaction statistics
  async getStats(): Promise<TransactionStats> {
    const response = await apiClient.get<ApiResponse<TransactionStats>>(
      '/transactions/stats'
    );
    return response.data.data;
  },
};

