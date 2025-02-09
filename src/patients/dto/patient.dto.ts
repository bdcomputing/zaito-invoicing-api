import { PartialType } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BasePatientDto } from './base-patient.dto';

export class RegisterPatientDto extends BasePatientDto {
  @IsString()
  @IsOptional()
  password?: string;
}

export class PostPatientDto extends RegisterPatientDto {
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class PatientDto extends PostPatientDto {
  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date | null;

  @IsDate()
  @IsOptional()
  deletedAt: Date | null;

  @IsOptional()
  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  updatedBy: string | null;

  @IsString()
  @IsOptional()
  deletedBy: string | null;
}

export class UpdatePatientDto extends PartialType(PostPatientDto) {}

export class PostUpdatedPatientDto extends UpdatePatientDto {
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @IsString()
  @IsNotEmpty()
  updatedBy: string;
}
