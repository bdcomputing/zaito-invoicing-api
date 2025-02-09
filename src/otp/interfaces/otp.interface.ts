import { Document } from 'mongoose';
import { OTPUseEnum } from '../enums/otp-use.enum';

export interface OTP extends Document {
  _id: string;
  code: string;
  phone?: string;
  token?: string;
  email?: string;
  use: OTPUseEnum;
  isActive: boolean;
  expiry: number;
}
