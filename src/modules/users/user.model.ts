import mongoose, { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './user.interface';

const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  name: { type: String },
  profilePic: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  isVerified: { type: Boolean, default: false },
});

// Hash password before saving
userSchema.pre('save', async function (this: mongoose.Document & IUser, next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

const UserModel = model<IUser>('User', userSchema);
export default UserModel;
