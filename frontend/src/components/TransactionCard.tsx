import { ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/contexts/FinanceContext";
import { cn } from "@/lib/utils";

interface TransactionCardProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
}

export const TransactionCard = ({ transaction, onDelete }: TransactionCardProps) => {
  const isIncome = transaction.type === "income";
  const date = new Date(transaction.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const categoryColors = {
    needs: "bg-expense/10 text-expense",
    wants: "bg-warning/10 text-warning",
    savings: "bg-success/10 text-success",
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              isIncome ? "bg-success/10" : "bg-expense/10"
            )}
          >
            {isIncome ? (
              <ArrowUpRight className="w-5 h-5 text-success" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-expense" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{transaction.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">{date}</span>
              {transaction.type === "expense" && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    categoryColors[transaction.category]
                  )}
                >
                  {transaction.category}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <p
            className={cn(
              "text-lg font-bold whitespace-nowrap",
              isIncome ? "text-success" : "text-expense"
            )}
          >
            {isIncome ? "+" : "-"}$
            {transaction.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(transaction.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
