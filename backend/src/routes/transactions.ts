import { Router } from 'express';
import { TransactionController } from '@/controllers/transactionController';
import { authenticateToken } from '@/middleware/auth';
import { sensitiveLimiter } from '@/middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Transaction CRUD operations
router.post('/', sensitiveLimiter, TransactionController.createTransaction);
router.get('/', TransactionController.getTransactions);
router.get('/stats', TransactionController.getStats);
router.get('/:id', TransactionController.getTransaction);
router.put('/:id', sensitiveLimiter, TransactionController.updateTransaction);
router.delete('/:id', sensitiveLimiter, TransactionController.deleteTransaction);

export default router;
