import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFinance } from "@/contexts/FinanceContext";
import { Plus, Target, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.targetAmount) {
      toast.error("Please fill in required fields");
      return;
    }

    addGoal({
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      deadline: formData.deadline,
    });

    toast.success("Goal created successfully");
    setIsOpen(false);
    setFormData({ title: "", targetAmount: "", deadline: "" });
  };

  const handleAddProgress = (id: string, amount: number) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) {
      updateGoal(id, { currentAmount: goal.currentAmount + amount });
      toast.success("Progress updated");
    }
  };

  const handleDelete = (id: string) => {
    deleteGoal(id);
    toast.success("Goal deleted");
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Financial Goals</h1>
            <p className="text-muted-foreground">Track your savings goals</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Emergency Fund"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target">Target Amount</Label>
                  <Input
                    id="target"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.targetAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, targetAmount: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline (Optional)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-primary">
                  Create Goal
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {goals.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground">
              Create your first financial goal to start saving
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const isComplete = progress >= 100;
              
              return (
                <Card key={goal.id} className="p-6 animate-fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      {goal.deadline && (
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(goal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        {Math.min(progress, 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        ${goal.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        of ${goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!isComplete && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddProgress(goal.id, 10)}
                        className="flex-1"
                      >
                        +$10
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddProgress(goal.id, 50)}
                        className="flex-1"
                      >
                        +$50
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddProgress(goal.id, 100)}
                        className="flex-1"
                      >
                        +$100
                      </Button>
                    </div>
                  )}
                  
                  {isComplete && (
                    <div className="bg-success/10 text-success px-3 py-2 rounded-lg text-center font-medium">
                      🎉 Goal Achieved!
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
