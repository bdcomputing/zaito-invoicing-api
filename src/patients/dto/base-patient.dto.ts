import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class BasePatientDto {
  @IsNotEmpty()
  @IsString()
  patientName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  KRA_PIN?: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  patientManager?: string;

  @IsNumber()
  @IsOptional()
  openingBalance?: number;

  @IsString()
  @IsOptional()
  idNumber?: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;
}
