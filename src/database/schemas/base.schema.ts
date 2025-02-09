import { Schema } from 'mongoose';

export const BSchema = new Schema({
  isActive: {
    type: Boolean,
    required: true,
    trim: true,
    default: true,
  },
  uniqueId: {
    type: Number,
    required: false,
    trim: true,
  },
  updatedBy: {
    type: String,
    required: false,
    trim: true,
  },
  deletedBy: {
    type: String,
    required: false,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
    trim: true,
  },
  updatedAt: {
    type: Date,
    required: false,
    trim: true,
  },
  deletedAt: {
    type: Date,
    required: false,
    trim: true,
  },
});

export const BaseSchema = new Schema({
  ...BSchema.obj,
  createdBy: {
    type: String,
    required: true,
    trim: true,
  },
});

export const PlainBaseSchema = new Schema({
  ...BSchema.obj,
  createdBy: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
});
