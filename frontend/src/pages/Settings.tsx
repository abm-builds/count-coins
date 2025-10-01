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
import { useAuth } from "@/contexts/AuthContext";
import { useFinance, BudgetRule } from "@/contexts/FinanceContext";
import { Moon, Sun, Download, Upload, LogOut, UserX } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, deleteAccount } = useAuth();
  const { budgetRule, setBudgetRule, transactions, goals, addTransaction, addGoal, refetchAll } = useFinance();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This will permanently delete all your data and cannot be undone."
      )
    ) {
      try {
        await deleteAccount();
        navigate("/login");
      } catch (error) {
        // Error is handled by AuthContext
      }
    }
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate data structure
      if (!data.transactions && !data.goals) {
        toast.error("Invalid data file format");
        return;
      }

      let importedCount = 0;

      // Import transactions
      if (data.transactions && Array.isArray(data.transactions)) {
        for (const transaction of data.transactions) {
          try {
            await addTransaction({
              amount: transaction.amount,
              type: transaction.type,
              category: transaction.category,
              description: transaction.description,
              date: transaction.date,
            });
            importedCount++;
          } catch (error) {
            console.error("Failed to import transaction:", error);
          }
        }
      }

      // Import goals
      if (data.goals && Array.isArray(data.goals)) {
        for (const goal of data.goals) {
          try {
            await addGoal({
              title: goal.title,
              targetAmount: goal.targetAmount,
              currentAmount: goal.currentAmount,
              deadline: goal.deadline,
            });
            importedCount++;
          } catch (error) {
            console.error("Failed to import goal:", error);
          }
        }
      }

      // Import budget rule if present
      if (data.budgetRule) {
        try {
          await setBudgetRule(data.budgetRule);
        } catch (error) {
          console.error("Failed to import budget rule:", error);
        }
      }

      refetchAll();
      toast.success(`Successfully imported ${importedCount} items!`);
    } catch (error) {
      toast.error("Failed to import data. Please check the file format.");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
            <h2 className="text-lg font-semibold mb-4">Account</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-base font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              {user?.name && (
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base font-medium">Name</Label>
                    <p className="text-sm text-muted-foreground">{user.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
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
                onValueChange={async (value: BudgetRule) => {
                  try {
                    await setBudgetRule(value);
                  } catch (error) {
                    // Error is handled by FinanceContext
                  }
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
              
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Export your data as JSON or import previously exported data
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Account Actions</h2>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleDeleteAccount}
              >
                <UserX className="w-4 h-4 mr-2" />
                Delete Account
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
