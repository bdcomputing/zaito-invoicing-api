import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { BaseSchema } from 'src/database/schemas/base.schema';

export const FileManagerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  file: {
    type: Object,
    required: false,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },

  // Extend Base Schema
  ...BaseSchema.obj,
});

export const FileManager = mongoose.model(
  DatabaseModelEnums.FILE_MANAGER_MODEL,
  FileManagerSchema,
);
