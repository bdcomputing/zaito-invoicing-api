import {
  IsOptional,
  IsDate,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { OTPUseEnum } from '../enums/otp-use.enum';

export class GenerateOTPDto {
  code: string;
  phone: string;
  isActive: boolean;
  expiry: number;
}
export class GeneratePasswordResetOTPDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsEnum(OTPUseEnum)
  @IsString()
  use: string;

  @IsNotEmpty()
  @IsNumber()
  expiry: number;
}
export class AccountVerificationCodeOTPDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsEnum(OTPUseEnum)
  @IsString()
  use: string;

  @IsNotEmpty()
  @IsNumber()
  expiry: number;
}
export class OTPDto extends GenerateOTPDto {
  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date | null;

  @IsDate()
  @IsOptional()
  deletedAt: Date | null;

  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  updatedBy: string | null;

  @IsString()
  @IsOptional()
  deletedBy: string | null;
}
