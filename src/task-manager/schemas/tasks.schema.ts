import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { BaseSchema } from 'src/database/schemas/base.schema';

export const TasksSchema = new mongoose.Schema({
  assignee: {
    type: String,
    required: false,
    trim: true,
  },
  batchNo: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: false,
    trim: true,
  },

  link: {
    type: String,
    required: false,
    trim: true,
  },

  isActive: {
    type: Boolean,
    required: true,
    default: true,
    trim: true,
  },
  overdue: {
    type: Boolean,
    required: true,
    default: false,
    trim: true,
  },

  minutesOverdue: {
    type: Number,
    required: true,
    default: 0,
    trim: true,
  },

  isSelfTask: {
    type: Boolean,
    required: true,
    default: false,
    trim: true,
  },

  deadline: {
    type: Date,
    required: false,
    trim: true,
  },

  reminderDate: {
    type: Date,
    required: false,
    trim: true,
  },

  assigneeDone: {
    type: Boolean,
    required: true,
    default: false,
    trim: true,
  },

  reporterDone: {
    type: Boolean,
    required: true,
    default: false,
    trim: true,
  },
  assignedAt: {
    type: Date,
    required: false,
    trim: true,
  },

  // Extend Base Schema
  ...BaseSchema.obj,
});

export const TasksRate = mongoose.model(
  DatabaseModelEnums.TASKS_MODEL,
  TasksSchema,
);
