import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import authService from './auth.service';
import { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../users/user.interface';

const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  await authService.register({ email, password, name });

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'User registered successfully',
    data: {
      user: {
        email,
        name,
      },
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await authService.login({ email, password });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Login successful',
    data: { token },
  });
});

const adminLogin = catchAsync(async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  console.log('Admin login attempt with identifier:', req.body);
  const token = await authService.adminLogin({ identifier, password });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Admin login successful',
    data: { token },
  });
});

const updateAdminProfile = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const { name } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const user: IUser = await authService.updateAdminProfile(userId, {name}, req.file);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Profile updated successfully',
      data: { name: user.name, profilePic: user.profilePic },
    });
  }
);

const getProfile = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('Unauthorized'); 
    }

    const user: IUser = await authService.getProfile(userId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Profile retrieved successfully',
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgotPassword(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Password reset link sent to your email',
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.body;
  await authService.resetPassword(email, token, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Password reset successful',
    data: null,
  });
});

const AuthController = {
  register,
  login,
  adminLogin,
  forgotPassword,
  resetPassword,
  updateAdminProfile,
  getProfile,
};
export default AuthController;
