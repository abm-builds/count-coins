import { BalanceCard } from "@/components/BalanceCard";
import { BudgetChart } from "@/components/BudgetChart";
import { TransactionCard } from "@/components/TransactionCard";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { transactions } = useFinance();
  const navigate = useNavigate();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Track your financial journey</p>
          </div>
        </div>

        <BalanceCard />

        <BudgetChart />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/transactions")}
            >
              View All
            </Button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your finances by adding your first transaction
              </p>
              <Button onClick={() => navigate("/transactions")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="animate-fade-in">
                  <TransactionCard transaction={transaction} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
