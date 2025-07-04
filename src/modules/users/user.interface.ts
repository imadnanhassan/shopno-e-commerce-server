import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  phone?: string;
  password: string;
  role: 'admin' | 'customer';
  name?: string;
  profilePic?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  isVerified: boolean;
}
