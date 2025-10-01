import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService, CreateTransactionData } from "@/services/transactionService";
import { budgetService } from "@/services/budgetService";
import { goalService, CreateGoalData } from "@/services/goalService";
import { useToast } from "@/hooks/use-toast";

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

interface FinanceContextType {
  budgetRule: BudgetRule;
  setBudgetRule: (rule: BudgetRule) => Promise<void>;
  budgetAllocation: BudgetAllocation;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "date"> & { date?: string }) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "currentAmount"> & { currentAmount?: number }) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
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

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    const saved = localStorage.getItem("finance-onboarding");
    return saved === "true";
  });

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem("auth-token");

  // Fetch transactions
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: transactionService.getTransactions,
    enabled: isAuthenticated,
  });

  // Fetch budget
  const { data: budget } = useQuery({
    queryKey: ["budget"],
    queryFn: budgetService.getBudget,
    enabled: isAuthenticated,
  });

  // Fetch goals
  const { data: goals = [], isLoading: isLoadingGoals } = useQuery({
    queryKey: ["goals"],
    queryFn: goalService.getGoals,
    enabled: isAuthenticated,
  });

  const budgetRule: BudgetRule = budget?.rule || "50/30/20";
  const budgetAllocation = budget?.customAllocation || BUDGET_RULES[budgetRule];

  // Mutations
  const updateBudgetMutation = useMutation({
    mutationFn: (data: { rule: BudgetRule; customAllocation?: BudgetAllocation }) => {
      if (budget) {
        return budgetService.updateBudget(data);
      }
      return budgetService.createBudget(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      toast({ title: "Success", description: "Budget updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update budget",
        variant: "destructive",
      });
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["budget"] });
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

  const deleteTransactionMutation = useMutation({
    mutationFn: transactionService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["budget"] });
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

  const createGoalMutation = useMutation({
    mutationFn: goalService.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({ title: "Success", description: "Goal added successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add goal",
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
    mutationFn: goalService.deleteGoal,
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

  // Helper functions
  const setBudgetRuleAsync = async (rule: BudgetRule) => {
    await updateBudgetMutation.mutateAsync({ rule });
  };

  const addTransaction = async (transaction: Omit<Transaction, "id" | "date"> & { date?: string }) => {
    const data: CreateTransactionData = {
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date,
    };
    await createTransactionMutation.mutateAsync(data);
  };

  const deleteTransaction = async (id: string) => {
    await deleteTransactionMutation.mutateAsync(id);
  };

  const addGoal = async (goal: Omit<Goal, "id" | "currentAmount"> & { currentAmount?: number }) => {
    const data: CreateGoalData = {
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline,
    };
    await createGoalMutation.mutateAsync(data);
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    await updateGoalMutation.mutateAsync({ id, updates });
  };

  const deleteGoal = async (id: string) => {
    await deleteGoalMutation.mutateAsync(id);
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem("finance-onboarding", "true");
  };

  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["budget"] });
    queryClient.invalidateQueries({ queryKey: ["goals"] });
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const isLoading = isLoadingTransactions || isLoadingGoals;

  return (
    <FinanceContext.Provider
      value={{
        budgetRule,
        setBudgetRule: setBudgetRuleAsync,
        budgetAllocation,
        transactions,
        addTransaction,
        deleteTransaction,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
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
