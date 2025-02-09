import { Document } from 'mongoose';

export interface JwtPayload extends Document {
  sub: number;
  name: string;
  phone: string;
  isBackOfficeUser: boolean;
  email: string;
}
