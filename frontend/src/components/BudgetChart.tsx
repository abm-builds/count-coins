import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { useFinance } from "@/contexts/FinanceContext";
import { motion } from "framer-motion";

const COLORS = {
  needs: "#ef4444",
  wants: "#f59e0b", 
  savings: "#10b981",
};

export const BudgetChart = () => {
  const { transactions, budgetAllocation } = useFinance();

  // Calculate expenses by category
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        const category = transaction.category;
        acc[category] = (acc[category] || 0) + transaction.amount;
        return acc;
      },
      {} as Record<string, number>
    );

  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

  const chartData = Object.entries(budgetAllocation).map(([category, percentage]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: expensesByCategory[category] || 0,
    target: (totalExpenses * percentage) / 100,
    percentage,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isOverTarget = data.value > data.target;
      
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            ₹{data.value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <div className={`text-xs ${isOverTarget ? 'text-red-500' : 'text-green-500'}`}>
            {isOverTarget ? 'Over' : 'Under'} target by ₹{Math.abs(data.value - data.target).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
        </div>
      );
    }
    return null;
  };

  if (totalExpenses === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <div className="text-center py-8 text-muted-foreground">
            <p>No expenses yet</p>
            <p className="text-sm">Add some transactions to see your spending breakdown</p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Spending by Category</h3>
          <div className="text-sm text-muted-foreground">
            Total: ₹{totalExpenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Mobile-first responsive chart */}
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                label={false} // Disable labels on chart to prevent cutoff
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [
                  `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
                  'Amount'
                ]}
                content={<CustomTooltip />}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend below chart - mobile optimized */}
        <div className="mt-4 space-y-2">
          {chartData.map((item, index) => {
            const isOverTarget = item.value > item.target;
            const percentage = totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(0) : 0;
            
            return (
              <motion.div
                key={item.name}
                className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[item.name.toLowerCase() as keyof typeof COLORS] }}
                  />
                  <span className="text-sm font-medium truncate">{item.name}</span>
                  <span className="text-xs text-muted-foreground ml-1">{percentage}%</span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-sm font-semibold">
                    ₹{item.value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`text-xs ${isOverTarget ? 'text-red-500' : 'text-green-500'}`}>
                    {isOverTarget ? 'Over' : 'Under'} target by ₹{Math.abs(item.value - item.target).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};