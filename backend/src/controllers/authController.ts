import { Request, Response } from 'express';
import { AuthService } from '@/services/authService';
import { validateRequest } from '@/utils/validation';
import { signupSchema, loginSchema, requestPasswordResetSchema, resetPasswordSchema } from '@/utils/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

export class AuthController {
  static signup = asyncHandler(async (req: Request, res: Response) => {
    const data = validateRequest(signupSchema, req.body);
    const result = await AuthService.signup(data);

    res.status(201).json({
      success: true,
      data: result,
      message: 'User created successfully',
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const data = validateRequest(loginSchema, req.body);
    const result = await AuthService.login(data);

    res.json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  });

  static getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await AuthService.getProfile(req.user!.id);

    res.json({
      success: true,
      data: { user },
    });
  });

  static updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validateRequest(loginSchema.partial(), req.body);
    const user = await AuthService.updateProfile(req.user!.id, data as { email?: string; password?: string });

    res.json({
      success: true,
      data: { user },
      message: 'Profile updated successfully',
    });
  });

  static deleteAccount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await AuthService.deleteAccount(req.user!.id);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  });

  static requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
    const data = validateRequest(requestPasswordResetSchema, req.body);
    await AuthService.requestPasswordReset(data.email);

    res.json({
      success: true,
      message: 'If an account with that email exists, we have sent password reset instructions.',
    });
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const data = validateRequest(resetPasswordSchema, req.body);
    await AuthService.resetPassword(data.token, data.password);

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  });
}
