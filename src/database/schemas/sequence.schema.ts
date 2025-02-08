import mongoose from 'mongoose';
import { DatabaseModelEnums } from '../enums/database.enum';

export const SequenceSchema = new mongoose.Schema({
  invoices: { type: Number, required: true, default: 0, trim: true },
  queues: { type: Number, required: true, default: 0, trim: true },
  appointments: { type: Number, required: true, default: 0, trim: true },
  patients: { type: Number, required: true, default: 0, trim: true },
});

export const Sequence = mongoose.model(
  DatabaseModelEnums.SEQUENCE_MODEL,
  SequenceSchema,
);
