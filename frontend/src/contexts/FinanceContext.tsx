import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  setBudgetRule: (rule: BudgetRule) => void;
  budgetAllocation: BudgetAllocation;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const BUDGET_RULES: Record<BudgetRule, BudgetAllocation> = {
  "50/30/20": { needs: 50, wants: 30, savings: 20 },
  "60/20/20": { needs: 60, wants: 20, savings: 20 },
  "70/20/10": { needs: 70, wants: 20, savings: 10 },
  custom: { needs: 33, wants: 33, savings: 34 },
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [budgetRule, setBudgetRule] = useState<BudgetRule>(() => {
    const saved = localStorage.getItem("finance-budgetRule");
    return (saved as BudgetRule) || "50/30/20";
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("finance-transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("finance-goals");
    return saved ? JSON.parse(saved) : [];
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    const saved = localStorage.getItem("finance-onboarding");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("finance-budgetRule", budgetRule);
  }, [budgetRule]);

  useEffect(() => {
    localStorage.setItem("finance-transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("finance-goals", JSON.stringify(goals));
  }, [goals]);

  const budgetAllocation = BUDGET_RULES[budgetRule];

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal = { ...goal, id: crypto.randomUUID() };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem("finance-onboarding", "true");
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <FinanceContext.Provider
      value={{
        budgetRule,
        setBudgetRule,
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
