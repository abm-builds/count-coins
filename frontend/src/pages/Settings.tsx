import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useFinance, BudgetRule } from "@/contexts/FinanceContext";
import { Moon, Sun, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { budgetRule, setBudgetRule, transactions, goals } = useFinance();

  const handleExportData = () => {
    const data = {
      transactions,
      goals,
      budgetRule,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financeflow-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Data exported successfully");
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences</p>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "light" ? (
                  <Sun className="w-5 h-5 text-warning" />
                ) : (
                  <Moon className="w-5 h-5 text-primary" />
                )}
                <div>
                  <Label htmlFor="theme-toggle" className="text-base font-medium">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark theme
                  </p>
                </div>
              </div>
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Budget Settings</h2>
            <div className="space-y-2">
              <Label htmlFor="budget-rule">Budget Rule</Label>
              <Select
                value={budgetRule}
                onValueChange={(value: BudgetRule) => {
                  setBudgetRule(value);
                  toast.success("Budget rule updated");
                }}
              >
                <SelectTrigger id="budget-rule">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50/30/20">50/30/20 Rule</SelectItem>
                  <SelectItem value="60/20/20">60/20/20 Rule</SelectItem>
                  <SelectItem value="70/20/10">70/20/10 Rule</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose how to allocate your budget across Needs, Wants, and Savings
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Data Management</h2>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleClearData}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 text-center text-sm text-muted-foreground">
          <p>FinanceFlow v1.0.0</p>
          <p className="mt-1">Made with ❤️ for better financial wellness</p>
        </Card>
      </div>
    </div>
  );
}
