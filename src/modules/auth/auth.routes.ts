import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { adminLoginSchema, forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, updateProfileSchema } from './auth.schema';
import AuthController from './auth.controller';
import { protect, restrictTo } from '../../middlewares/auth';
import upload from '../../middlewares/multer';
const AuthRouter = Router();

// Customer routes
AuthRouter.post('/register', validate(registerSchema), AuthController.register);
AuthRouter.post('/login', validate(loginSchema), AuthController.login);


// Admin routes
AuthRouter.post('/admin/login', validate(adminLoginSchema), AuthController.adminLogin);
AuthRouter.patch(
  '/admin/profile',
  protect,
  restrictTo('admin'),
  upload.single('profilePic'),
  validate(updateProfileSchema),
  AuthController.updateAdminProfile
);

// Common routes
AuthRouter.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  AuthController.forgotPassword
);
AuthRouter.post(
  '/reset-password',
  validate(resetPasswordSchema),
  AuthController.resetPassword
);
AuthRouter.get(
  '/profile',
  protect,
  AuthController.getProfile
);

export default AuthRouter;
