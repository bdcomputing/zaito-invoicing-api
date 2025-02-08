import { PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsOptional()
  @IsString()
  assignee: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsBoolean()
  assigneeDone?: boolean;

  @IsOptional()
  @IsBoolean()
  reporterDone?: boolean;

  @IsString()
  @IsOptional()
  deadline: Date | string;

  @IsString()
  @IsOptional()
  reminderDate: Date | string;

  @IsBoolean()
  @IsOptional()
  isSelfTask: boolean;
}

export class PostTaskDto extends CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @IsNotEmpty()
  @IsDate()
  assignedAt: Date;

  @IsNotEmpty()
  @IsString()
  batchNo: string;
}

export class UpdateTaskDto extends PartialType(PostTaskDto) {}
export class PostUpdatedTaskDto extends UpdateTaskDto {
  @IsNotEmpty()
  @IsString()
  updatedBy: string;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
