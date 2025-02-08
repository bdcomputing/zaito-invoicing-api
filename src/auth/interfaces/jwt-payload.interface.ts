import { Document } from 'mongoose';

export interface JwtPayloadInterface extends Document {
  sub: number;
  name: string;
  phone: string;
  isBackOfficeUser: boolean;
  email: string;
}
