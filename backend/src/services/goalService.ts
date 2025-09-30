import { prisma } from '@/config/database';
import { Goal } from '@prisma/client';
import { CreateGoalRequest, UpdateGoalRequest } from '@/types';
import { createError } from '@/middleware/errorHandler';

export class GoalService {
  static async createGoal(userId: string, data: CreateGoalRequest): Promise<Goal> {
    const goal = await prisma.goal.create({
      data: {
        ...data,
        userId,
        deadline: data.deadline ? new Date(data.deadline) : null,
      },
    });

    return goal;
  }

  static async getGoals(userId: string): Promise<Goal[]> {
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return goals;
  }

  static async getGoalById(userId: string, goalId: string): Promise<Goal> {
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
    });

    if (!goal) {
      throw createError('Goal not found', 404);
    }

    return goal;
  }

  static async updateGoal(
    userId: string,
    goalId: string,
    data: UpdateGoalRequest
  ): Promise<Goal> {
    // Check if goal exists and belongs to user
    await this.getGoalById(userId, goalId);

    const updateData: any = { ...data };
    if (data.deadline) {
      updateData.deadline = new Date(data.deadline);
    }

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: updateData,
    });

    return goal;
  }

  static async deleteGoal(userId: string, goalId: string): Promise<void> {
    // Check if goal exists and belongs to user
    await this.getGoalById(userId, goalId);

    await prisma.goal.delete({
      where: { id: goalId },
    });
  }

  static async getGoalProgress(userId: string): Promise<{
    totalGoals: number;
    completedGoals: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
    averageProgress: number;
  }> {
    const goals = await this.getGoals(userId);

    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => Number(g.currentAmount) >= Number(g.targetAmount)).length;
    const totalTargetAmount = goals.reduce((sum, g) => sum + Number(g.targetAmount), 0);
    const totalCurrentAmount = goals.reduce((sum, g) => sum + Number(g.currentAmount), 0);
    const averageProgress = totalGoals > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

    return {
      totalGoals,
      completedGoals,
      totalTargetAmount,
      totalCurrentAmount,
      averageProgress,
    };
  }
}
