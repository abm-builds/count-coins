import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService, CreateTransactionData } from "@/services/transactionService";
import { budgetService } from "@/services/budgetService";
import { goalService, CreateGoalData } from "@/services/goalService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

export type BudgetRule = "50/30/20" | "60/20/20" | "70/20/10" | "custom";
export type TransactionCategory = "needs" | "wants" | "savings";
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  description: string;
  date: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface BudgetAllocation {
  needs: number;
  wants: number;
  savings: number;
}

export interface Budget {
  id: string;
  rule: BudgetRule;
  customAllocation?: BudgetAllocation;
  createdAt: string;
  updatedAt: string;
}

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "date"> & { date?: string }) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  budget: Budget | null;
  budgetRule: BudgetRule;
  budgetAllocation: BudgetAllocation;
  setBudgetRule: (rule: BudgetRule) => void;
  addBudget: (data: { rule: BudgetRule; customAllocation?: BudgetAllocation }) => Promise<void>;
  updateBudget: (data: { rule: BudgetRule; customAllocation?: BudgetAllocation }) => Promise<void>;
  addGoal: (goal: Omit<Goal, "id" | "currentAmount"> & { currentAmount?: number }) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  goals: Goal[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  isLoading: boolean;
  refetchAll: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const BUDGET_RULES: Record<BudgetRule, BudgetAllocation> = {
  "50/30/20": { needs: 50, wants: 30, savings: 20 },
  "60/20/20": { needs: 60, wants: 20, savings: 20 },
  "70/20/10": { needs: 70, wants: 20, savings: 10 },
  custom: { needs: 33, wants: 33, savings: 34 },
};

// Helper function to validate and clean transaction data
const validateTransaction = (transaction: any): Transaction | null => {
  if (!transaction || typeof transaction !== 'object') return null;
  
  const { id, amount, category, type, description, date } = transaction;
  
  // Validate required fields
  if (!id || !category || !type || !description || !date) {
    return null;
  }
  
  // Convert amount to number (handle both string and number)
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (isNaN(numericAmount) || numericAmount < 0) {
    return null;
  }
  
  return {
    id: String(id),
    amount: numericAmount,
    category: String(category) as TransactionCategory,
    type: String(type) as TransactionType,
    description: String(description),
    date: String(date),
  };
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    const saved = localStorage.getItem("countcoins-onboarding");
    return saved === "true";
  });

  // Fetch transactions
  const { data: rawTransactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: transactionService.getTransactions,
    enabled: isAuthenticated,
    retry: false,
  });

  // Validate and clean transactions
  const transactions = React.useMemo(() => {
    if (!Array.isArray(rawTransactions)) {
      return [];
    }
    
    const validTransactions = rawTransactions
      .map(validateTransaction)
      .filter((transaction): transaction is Transaction => transaction !== null);
    
    return validTransactions;
  }, [rawTransactions]);

  // Fetch budget
  const { data: budget } = useQuery({
    queryKey: ["budget"],
    queryFn: budgetService.getBudget,
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch goals
  const { data: goals = [], isLoading: isLoadingGoals } = useQuery({
    queryKey: ["goals"],
    queryFn: goalService.getGoals,
    enabled: isAuthenticated,
    retry: false,
  });

  const budgetRule: BudgetRule = budget?.rule || "50/30/20";
  const budgetAllocation = budget?.customAllocation || BUDGET_RULES[budgetRule];

  // Mutations
  const updateBudgetMutation = useMutation({
    mutationFn: (data: { rule: BudgetRule; customAllocation?: BudgetAllocation }) => {
      return budgetService.createOrUpdateBudget(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      toast({ title: "Success", description: "Budget updated successfully" });
    },
    onError: (error: any) => {
      console.error('Budget mutation failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update budget",
        variant: "destructive",
      });
    },
  });

  const addTransactionMutation = useMutation({
    mutationFn: (data: CreateTransactionData) => transactionService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({ title: "Success", description: "Transaction added successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add transaction",
        variant: "destructive",
      });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Transaction> }) =>
      transactionService.updateTransaction(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({ title: "Success", description: "Transaction updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update transaction",
        variant: "destructive",
      });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({ title: "Success", description: "Transaction deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      });
    },
  });

  const addGoalMutation = useMutation({
    mutationFn: (data: CreateGoalData) => goalService.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({ title: "Success", description: "Goal created successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create goal",
        variant: "destructive",
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Goal> }) =>
      goalService.updateGoal(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({ title: "Success", description: "Goal updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update goal",
        variant: "destructive",
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id: string) => goalService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({ title: "Success", description: "Goal deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete goal",
        variant: "destructive",
      });
    },
  });

  // Calculate totals
  const totalIncome = React.useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => {
        const amount = Number(t.amount);
        return isNaN(amount) ? sum : sum + amount;
      }, 0);
  }, [transactions]);

  const totalExpenses = React.useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => {
        const amount = Number(t.amount);
        return isNaN(amount) ? sum : sum + amount;
      }, 0);
  }, [transactions]);

  const balance = React.useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  const isLoading = isLoadingTransactions || isLoadingGoals;

  const setBudgetRule = (rule: BudgetRule) => {
    updateBudgetMutation.mutate({ rule });
  };

  const addBudget = async (data: { rule: BudgetRule; customAllocation?: BudgetAllocation }) => {
    updateBudgetMutation.mutate(data);
  };

  const updateBudget = async (data: { rule: BudgetRule; customAllocation?: BudgetAllocation }) => {
    updateBudgetMutation.mutate(data);
  };

  const addTransaction = async (transaction: Omit<Transaction, "id" | "date"> & { date?: string }) => {
    addTransactionMutation.mutate(transaction);
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    updateTransactionMutation.mutate({ id, updates });
  };

  const deleteTransaction = async (id: string) => {
    deleteTransactionMutation.mutate(id);
  };

  const addGoal = async (goal: Omit<Goal, "id" | "currentAmount"> & { currentAmount?: number }) => {
    addGoalMutation.mutate(goal);
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    updateGoalMutation.mutate({ id, updates });
  };

  const deleteGoal = async (id: string) => {
    deleteGoalMutation.mutate(id);
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem("countcoins-onboarding", "true");
  };

  const refetchAll = () => {
    queryClient.invalidateQueries();
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        budget,
        budgetRule,
        budgetAllocation,
        setBudgetRule,
        addBudget,
        updateBudget,
        addGoal,
        updateGoal,
        deleteGoal,
        goals,
        totalIncome,
        totalExpenses,
        balance,
        hasCompletedOnboarding,
        completeOnboarding,
        isLoading,
        refetchAll,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};