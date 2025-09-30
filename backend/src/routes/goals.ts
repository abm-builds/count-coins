import { Router } from 'express';
import { GoalController } from '@/controllers/goalController';
import { authenticateToken } from '@/middleware/auth';
import { sensitiveLimiter } from '@/middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Goal CRUD operations
router.post('/', sensitiveLimiter, GoalController.createGoal);
router.get('/', GoalController.getGoals);
router.get('/progress', GoalController.getGoalProgress);
router.get('/:id', GoalController.getGoal);
router.put('/:id', sensitiveLimiter, GoalController.updateGoal);
router.delete('/:id', sensitiveLimiter, GoalController.deleteGoal);

export default router;
