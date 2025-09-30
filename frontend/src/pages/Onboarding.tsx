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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
            <PiggyBank className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to FinanceFlow</h1>
          <p className="text-muted-foreground">
            Choose a budgeting rule to get started
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {budgetRules.map((item) => (
            <Card
              key={item.rule}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedRule === item.rule
                  ? "ring-2 ring-primary bg-primary/5"
                  : ""
              }`}
              onClick={() => setSelectedRule(item.rule)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.popular && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedRule === item.rule
                      ? "border-primary bg-primary"
                      : "border-muted"
                  }`}
                >
                  {selectedRule === item.rule && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
          size="lg"
        >
          Continue to Dashboard
        </Button>
      </div>
    </div>
  );
}
