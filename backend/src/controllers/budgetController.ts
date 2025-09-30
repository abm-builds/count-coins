import { Request, Response } from 'express';
import { BudgetService } from '@/services/budgetService';
import { validateRequest } from '@/utils/validation';
import { createBudgetSchema } from '@/utils/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

export class BudgetController {
  static createBudget = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validateRequest(createBudgetSchema, req.body);
    const budget = await BudgetService.createBudget(req.user!.id, data);

    res.status(201).json({
      success: true,
      data: budget,
      message: 'Budget created successfully',
    });
  });

  static getBudget = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const budget = await BudgetService.getBudget(req.user!.id);

    if (!budget) {
      res.json({
        success: true,
        data: null,
        message: 'No budget found',
      });
      return;
    }

    res.json({
      success: true,
      data: budget,
    });
  });

  static updateBudget = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validateRequest(createBudgetSchema, req.body);
    const budget = await BudgetService.updateBudget(req.user!.id, data);

    res.json({
      success: true,
      data: budget,
      message: 'Budget updated successfully',
    });
  });

  static deleteBudget = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await BudgetService.deleteBudget(req.user!.id);

    res.json({
      success: true,
      message: 'Budget deleted successfully',
    });
  });

  static getBudgetSummary = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const summary = await BudgetService.getBudgetSummary(req.user!.id);

    res.json({
      success: true,
      data: summary,
    });
  });
}
