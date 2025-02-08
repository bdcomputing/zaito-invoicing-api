export interface LogInterface extends Document {
  ip: string;
  userId: string;
  userAgent: string;
  email: string;
  method: string;
  url: string;
  createdAt: Date;
}
