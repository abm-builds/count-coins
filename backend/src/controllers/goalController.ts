import { Request, Response } from 'express';
import { GoalService } from '@/services/goalService';
import { validateRequest } from '@/utils/validation';
import { createGoalSchema, updateGoalSchema } from '@/utils/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

export class GoalController {
  static createGoal = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validateRequest(createGoalSchema, req.body);
    const goal = await GoalService.createGoal(req.user!.id, data);

    res.status(201).json({
      success: true,
      data: goal,
      message: 'Goal created successfully',
    });
  });

  static getGoals = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const goals = await GoalService.getGoals(req.user!.id);

    res.json({
      success: true,
      data: goals,
    });
  });

  static getGoal = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const goal = await GoalService.getGoalById(req.user!.id, id);

    res.json({
      success: true,
      data: goal,
    });
  });

  static updateGoal = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const data = validateRequest(updateGoalSchema, req.body);
    const goal = await GoalService.updateGoal(req.user!.id, id, data);

    res.json({
      success: true,
      data: goal,
      message: 'Goal updated successfully',
    });
  });

  static deleteGoal = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    await GoalService.deleteGoal(req.user!.id, id);

    res.json({
      success: true,
      message: 'Goal deleted successfully',
    });
  });

  static getGoalProgress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const progress = await GoalService.getGoalProgress(req.user!.id);

    res.json({
      success: true,
      data: progress,
    });
  });
}
