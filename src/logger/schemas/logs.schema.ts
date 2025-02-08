import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';

export const LogsSchema = new mongoose.Schema({
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
    required: false,
    default: null,
    trim: true,
  },
  method: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
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

export const Logs = mongoose.model(DatabaseModelEnums.LOG_MODEL, LogsSchema);
