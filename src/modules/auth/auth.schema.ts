import { z } from 'zod';

// Register Schema (Customer)
export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  name: z.string().optional(),
});

// Login Schema (Customer)
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

// Admin Login Schema (email or phone)
export const adminLoginSchema = z.object({
  identifier: z.string().min(1, { message: 'Email or phone required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

// OTP Verification Schema
export const otpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

// Reset Password Schema
export const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  token: z.string().min(1, { message: 'Reset token required' }),
  newPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

// Profile Update Schema (Admin)
export const updateProfileSchema = z.object({
  name: z.string().optional(),
  profilePic: z.string().optional(),
});
