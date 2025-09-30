import { Request, Response } from 'express';
import { AuthService } from '@/services/authService';
import { validateRequest } from '@/utils/validation';
import { signupSchema, loginSchema } from '@/utils/validation';
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
    const user = await AuthService.updateProfile(req.user!.id, data);

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
}
