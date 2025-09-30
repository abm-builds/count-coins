import { Card } from "@/components/ui/card";
import { useFinance } from "@/contexts/FinanceContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = {
  needs: "hsl(var(--expense))",
  wants: "hsl(var(--warning))",
  savings: "hsl(var(--success))",
};

export const BudgetChart = () => {
  const { transactions, budgetAllocation, totalExpenses } = useFinance();

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        acc[t.category] += t.amount;
        return acc;
      },
      { needs: 0, wants: 0, savings: 0 }
    );

  const chartData = [
    { name: "Needs", value: expensesByCategory.needs, target: budgetAllocation.needs },
    { name: "Wants", value: expensesByCategory.wants, target: budgetAllocation.wants },
    { name: "Savings", value: expensesByCategory.savings, target: budgetAllocation.savings },
  ];

  return (
    <Card className="p-6 animate-fade-in-up">
      <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
      
      {totalExpenses === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>No expenses yet. Add your first transaction!</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      )}
      
      <div className="mt-4 space-y-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[item.name.toLowerCase() as keyof typeof COLORS] }}
              />
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground">({item.target}% target)</span>
            </div>
            <span className="font-semibold">
              ${item.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
