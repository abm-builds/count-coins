import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Layout } from "@/components/Layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFinance } from "@/contexts/FinanceContext";
import { Plus, Target, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount) return;

    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, {
          title: formData.title,
          targetAmount: parseFloat(formData.targetAmount),
          deadline: formData.deadline === "" ? undefined : formData.deadline,
        });
        setEditingGoal(null);
      } else {
        await addGoal({
          title: formData.title,
          targetAmount: parseFloat(formData.targetAmount),
          currentAmount: 0,
          deadline: formData.deadline === "" ? undefined : formData.deadline,
        });
      }
      setFormData({
        title: "",
        targetAmount: "",
        deadline: "",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };

  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      deadline: goal.deadline ? goal.deadline.split("T")[0] : "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      await deleteGoal(id);
    }
  };

  const handleAddProgress = async (goalId: string, amount: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
      await updateGoal(goalId, { currentAmount: newAmount });
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background pb-20 md:pb-8"
      >
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              {/* Logo - only show on mobile since sidebar has it on desktop */}
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 md:hidden">
                <img 
                  src="/logo.png" 
                  alt="CountCoins Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-primary">Goals</h1>
                <p className="text-muted-foreground">Track your financial goals</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingGoal ? "Edit Goal" : "Add New Goal"}
                  </DialogTitle>
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetAmount">Target Amount</Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.targetAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, targetAmount: e.target.value })
                      }
                      required
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
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingGoal ? "Update" : "Add"} Goal
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Goals Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {goals.length > 0 ? (
              goals.map((goal, index) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const isCompleted = progress >= 100;
                
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-lg">{goal.title}</h3>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(goal)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(goal.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progress.toFixed(0)}%</span>
                          </div>
                          <Progress 
                            value={progress} 
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Current</span>
                            <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Target</span>
                            <span className="font-medium">{formatCurrency(goal.targetAmount)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-semibold">
                            <span>Remaining</span>
                            <span className={isCompleted ? "text-green-600" : ""}>
                              {formatCurrency(goal.targetAmount - goal.currentAmount)}
                            </span>
                          </div>
                        </div>

                        {goal.deadline && (
                          <div className="text-sm text-muted-foreground">
                            Deadline: {new Date(goal.deadline).toLocaleDateString()}
                          </div>
                        )}

                        {!isCompleted && (
                          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs sm:text-sm"
                              onClick={() => handleAddProgress(goal.id, 100)}
                            >
                              +₹100
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs sm:text-sm"
                              onClick={() => handleAddProgress(goal.id, 500)}
                            >
                              +₹500
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs sm:text-sm"
                              onClick={() => handleAddProgress(goal.id, 1000)}
                            >
                              +₹1K
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs sm:text-sm"
                              onClick={() => handleAddProgress(goal.id, 5000)}
                            >
                              +₹5K
                            </Button>
                          </div>
                        )}

                        {isCompleted && (
                          <div className="text-center py-2">
                            <span className="text-green-600 font-semibold text-sm">
                              🎉 Goal Achieved!
                            </span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full">
                <Card className="p-8 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first financial goal to start tracking your progress.
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Goal
                  </Button>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}