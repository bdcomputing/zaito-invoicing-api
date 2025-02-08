import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';

export const AuthLogsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false,
    trim: true,
  },
  ip: {
    type: String,
    required: true,
    trim: true,
  },
  userAgent: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  loginSuccess: {
    type: Boolean,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
    trim: true,
  },
});

export const AuthLogs = mongoose.model(
  DatabaseModelEnums.AUTH_LOG_MODEL,
  AuthLogsSchema,
);
