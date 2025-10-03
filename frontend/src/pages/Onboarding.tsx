import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinance, BudgetRule } from "@/contexts/FinanceContext";
import { PiggyBank, Check } from "lucide-react";

const budgetRules = [
  {
    rule: "50/30/20" as BudgetRule,
    title: "50/30/20 Rule",
    description: "50% Needs, 30% Wants, 20% Savings",
    popular: true,
  },
  {
    rule: "60/20/20" as BudgetRule,
    title: "60/20/20 Rule",
    description: "60% Needs, 20% Wants, 20% Savings",
    popular: false,
  },
  {
    rule: "70/20/10" as BudgetRule,
    title: "70/20/10 Rule",
    description: "70% Needs, 20% Wants, 10% Savings",
    popular: false,
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { setBudgetRule, completeOnboarding } = useFinance();
  const [selectedRule, setSelectedRule] = useState<BudgetRule>("50/30/20");

  const handleContinue = () => {
    setBudgetRule(selectedRule);
    completeOnboarding();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="CountCoins Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to CountCoins
              </h1>
              <p className="text-muted-foreground">
                Choose a budgeting rule to get started
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Select Your Budgeting Strategy
          </h2>
          <div className="space-y-4">
            {budgetRules.map((budget) => (
              <div
                key={budget.rule}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRule === budget.rule
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedRule(budget.rule)}
              >
                {budget.popular && (
                  <div className="absolute -top-2 left-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{budget.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {budget.description}
                    </p>
                  </div>
                  {selectedRule === budget.rule && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={handleContinue}
            className="w-full mt-6 bg-gradient-primary"
          >
            Continue
          </Button>
        </Card>
      </div>
    </div>
  );
}