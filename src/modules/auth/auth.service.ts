import { env } from '../../config/env';
import { AppError } from '../../error/AppError';
import { UnauthorizeError } from '../../error/unauthorizeError';
import { sendEmail } from '../../utils/email';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { IUser } from '../users/user.interface';
import UserModel from '../users/user.model';
import {
  AdminLoginInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from './auth.interface';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User Registration (Customer)
const register = async (input: RegisterInput): Promise<void> => {
  const { email, password, name } = input;
  const user = await UserModel.findOne({ email });
  if (user) {
    throw new AppError('User already exists', 400);
  }
  const newUser = new UserModel({
    email,
    password,
    name,
    role: 'customer',
    isVerified: true,
  });
  await newUser.save();
};

// User Login (Customer)
const login = async (input: LoginInput): Promise<string> => {
  const { email, password } = input;
  const user = await UserModel.findOne({ email });
  if (!user || user.role !== 'customer') {
    throw new UnauthorizeError('Invalid credentials');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizeError('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
};

// Admin Login
const adminLogin = async (input: AdminLoginInput): Promise<string> => {
  const { identifier, password } = input;
  const user = await UserModel.findOne({
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
  const tokenPayload = {
    sub: user.id.toString(),
    role: user.role,
  };

  const token = jwt.sign(tokenPayload, env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
};

// Update Admin Profile
const updateAdminProfile = async (
  userId: string,
  input: UpdateProfileInput,
  file?: Express.Multer.File
): Promise<IUser> => {
  const user = await UserModel.findById(userId);
  if (!user || user.role !== 'admin') {
    throw new UnauthorizeError('Admin not found');
  }

  if (input.name) user.name = input.name;
  if (file) {
    const profilePic = await sendImageToCloudinary(file);
    user.profilePic = profilePic;
  }

  await user.save();
  return user;
};

const getProfile = async (userId: string): Promise<IUser> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

// Forgot Password
const forgotPassword = async (email: string): Promise<void> => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  const resetUrl = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
  await sendEmail(email, 'Password Reset', `Reset your password: ${resetUrl}`);
};

// Reset Password
export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string
): Promise<void> => {
  const user = await UserModel.findOne({
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
};

const authService = {
  register,
  login,
  adminLogin,
  updateAdminProfile,
  forgotPassword,
  resetPassword,
  getProfile,
};
export default authService;
//
