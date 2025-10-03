import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { authLimiter } from '@/middleware/rateLimiter';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// Public routes
router.post('/signup', authLimiter, AuthController.signup);
router.post('/login', authLimiter, AuthController.login);
router.post('/forgot-password', authLimiter, AuthController.requestPasswordReset);
router.post('/reset-password', authLimiter, AuthController.resetPassword);

// Protected routes
router.get('/me', authenticateToken, AuthController.getProfile);
router.put('/me', authenticateToken, AuthController.updateProfile);
router.delete('/me', authenticateToken, AuthController.deleteAccount);

export default router;
