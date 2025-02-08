export interface AuthLogInterface extends Document {
  ip: string;
  userId?: string;
  userAgent: string;
  email: string;
  loginSuccess: boolean;
  createdAt: Date;
}
