import { Document } from 'mongoose';
import { NotificationSubScriptions } from 'src/notifications/interfaces/notification-subscription.interface';

export interface User extends Document {
  _id: string;
  email: string;
  emailVerified: boolean;
  passwordResetCode: string;
  name: string;
  phone: string;
  otpId?: string;
  phoneVerified: boolean;
  magicLogin: boolean;
  verified: boolean;
  password: string;
  isBackOfficeUser: boolean;
  notifications: NotificationSubScriptions[];
  resetPasswordToken: string | null;
  isPasswordDefault: boolean;
  defaultShippingAddress: string | null;
  patientId: string | null;
  role?: string | null;
  profileImageUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastPasswordChange: Date;
}
