import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useFinance } from "@/contexts/FinanceContext";

export const BalanceCard = () => {
  const { balance, totalIncome, totalExpenses } = useFinance();

  return (
    <Card className="p-6 bg-gradient-primary text-white shadow-lg animate-fade-in">
      <p className="text-sm font-medium opacity-90 mb-2">Total Balance</p>
      <h2 className="text-4xl font-bold mb-6">
        ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </h2>
      
      <div className="flex gap-4">
        <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium opacity-90">Income</span>
          </div>
          <p className="text-lg font-semibold">
            ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs font-medium opacity-90">Expenses</span>
          </div>
          <p className="text-lg font-semibold">
            ${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </Card>
  );
};
