import { Router } from 'express';
import { BudgetController } from '@/controllers/budgetController';
import { authenticateToken } from '@/middleware/auth';
import { sensitiveLimiter } from '@/middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Budget operations
router.post('/', sensitiveLimiter, BudgetController.createBudget);
router.get('/', BudgetController.getBudget);
router.put('/', sensitiveLimiter, BudgetController.updateBudget);
router.delete('/', sensitiveLimiter, BudgetController.deleteBudget);
router.get('/summary', BudgetController.getBudgetSummary);

export default router;
