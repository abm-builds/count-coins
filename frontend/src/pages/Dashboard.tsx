import { BalanceCard } from "@/components/BalanceCard";
import { BudgetChart } from "@/components/BudgetChart";
import { TransactionCard } from "@/components/TransactionCard";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { useFinance } from "@/contexts/FinanceContext";
import { Plus, TrendingUp, Wallet, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { transactions, goals, totalIncome, totalExpenses, balance } = useFinance();
  const navigate = useNavigate();
  const recentTransactions = transactions.slice(0, 5);

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
  
  // Calculate goals progress
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
  const totalGoals = goals.length;

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background pb-20 md:pb-8"
      >
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            {/* Mobile-first header layout with logo */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Logo - only show on mobile since sidebar has it on desktop */}
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 md:hidden">
                  <img 
                    src="/logo.png" 
                    alt="CountCoins Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-1 truncate">Dashboard</h1>
                  <p className="text-muted-foreground text-sm sm:text-base">Track your financial journey</p>
                </div>
              </div>
              <Button
                onClick={() => navigate("/transactions")}
                className="bg-gradient-primary w-full sm:w-auto flex-shrink-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add Transaction</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </motion.div>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <BalanceCard />
          </motion.div>

          {/* Stats Grid - Only show if there's data */}
          {(transactions.length > 0 || goals.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {transactions.length > 0 && (
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Savings Rate</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{savingsRate}%</p>
                  <p className="text-xs text-muted-foreground">
                    {savingsRate >= 20 ? "Great job!" : savingsRate >= 10 ? "Good progress" : "Keep saving!"}
                  </p>
                </div>
              )}
              {goals.length > 0 && (
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">Goals</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{completedGoals}/{totalGoals}</p>
                  <p className="text-xs text-muted-foreground">
                    {completedGoals === totalGoals ? "All goals achieved!" : "Keep going!"}
                  </p>
                </div>
              )}
              {transactions.length > 0 && (
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Transactions</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{transactions.length}</p>
                  <p className="text-xs text-muted-foreground">Total recorded</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Charts and Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Chart - Only show if there are expenses */}
            {totalExpenses > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <BudgetChart />
              </motion.div>
            )}

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card p-6 rounded-lg border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/transactions")}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Add your first transaction to get started</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}