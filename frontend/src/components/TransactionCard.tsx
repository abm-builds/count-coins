import { ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/contexts/FinanceContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TransactionCardProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
}

export const TransactionCard = ({ transaction, onDelete }: TransactionCardProps) => {
  const isIncome = transaction.type === "income";
  const date = new Date(transaction.date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  const categoryColors = {
    needs: "bg-expense/10 text-expense",
    wants: "bg-warning/10 text-warning",
    savings: "bg-success/10 text-success",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                isIncome
                  ? "bg-success/10 text-success"
                  : "bg-expense/10 text-expense"
              )}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {isIncome ? (
                <ArrowUpRight className="w-5 h-5" />
              ) : (
                <ArrowDownRight className="w-5 h-5" />
              )}
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <motion.h3
                className="font-medium text-foreground truncate"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {transaction.description}
              </motion.h3>
              
              <div className="flex items-center gap-2 mt-1">
                <motion.span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium",
                    categoryColors[transaction.category]
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  {transaction.category}
                </motion.span>
                
                <motion.span
                  className="text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {date}
                </motion.span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.p
              className={cn(
                "font-semibold text-lg",
                isIncome ? "text-success" : "text-expense"
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isIncome ? "+" : "-"}₹
              {transaction.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </motion.p>
            
            {onDelete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(transaction.id)}
                  className="text-muted-foreground hover:text-destructive p-1 h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};