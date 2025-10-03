import { Router } from 'express';
import authRoutes from './auth';
import transactionRoutes from './transactions';
import budgetRoutes from './budget';
import goalRoutes from './goals';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budget', budgetRoutes);
router.use('/goals', goalRoutes);

// Health check endpoint
router.get('/health', (req: any, res: any) => {
  res.json({
    success: true,
    message: 'Count Coins API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
