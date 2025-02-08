import { Document } from 'mongoose';
import { NotificationSubScriptionsInterface } from 'src/notifications/interfaces/notification-subscription.interface';

export interface UserInterface extends Document {
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
  notifications: NotificationSubScriptionsInterface[];
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
