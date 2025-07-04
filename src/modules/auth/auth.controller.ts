import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import crypto from 'crypto';
import { catchAsync } from '../../utils/catchAsync';
import User from '../users/user.model';
import { AppError } from '../../error/AppError';
import { generateOTP } from '../../utils/otp';
import { sendEmail } from '../../utils/email';
import { sendResponse } from '../../utils/sendResponse';
import { UnauthorizeError } from '../../error/unauthorizeError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw new AppError('User already exists', 400);
  }

  const otp = generateOTP();
  const newUser = new User({ email, password, name, role: 'customer' });
  await newUser.save();

  await sendEmail(email, 'Verify Your Email', `Your OTP is ${otp}`);
  // Store OTP temporarily (e.g., in-memory or Redis)

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'User registered. Please verify OTP.',
    data: {
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        isVerified: newUser.isVerified,
      },
    },
  });
});

export const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  // Verify OTP (compare with stored OTP)
  user.isVerified = true;
  await user.save();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Email verified',
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.role !== 'customer') {
    throw new UnauthorizeError('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizeError('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1h',
    }
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Login successful',
    data: { token },
  });
});

export const adminLogin = catchAsync(async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
    role: 'admin',
  });

  if (!user) {
    throw new UnauthorizeError('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizeError('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1h',
    }
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Admin login successful',
    data: { token },
  });
});

export const updateAdminProfile = catchAsync(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizeError('Unauthorized');
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      throw new UnauthorizeError('Admin not found');
    }

    if (name) user.name = name;
    if (req.file) {
      const profilePic = await sendImageToCloudinary(req.file);
      user.profilePic = profilePic;
    }

    await user.save();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Profile updated successfully',
      data: { name: user.name, profilePic: user.profilePic },
    });
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetUrl = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
    await sendEmail(
      email,
      'Password Reset',
      `Reset your password: ${resetUrl}`
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Password reset link sent',
      data: { resetToken },
    });
  }
);

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.body;

  const user = await User.findOne({
    email,
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Password reset successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    },
  });
});
