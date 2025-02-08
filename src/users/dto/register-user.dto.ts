import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsOptional()
  clinicId?: string | null;

  @IsString()
  @IsOptional()
  patientId?: string | null;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
export class PostUserDto extends RegisterUserDto {
  @IsBoolean()
  @IsNotEmpty()
  isBackOfficeUser: boolean;

  @IsString()
  @IsOptional()
  createdBy?: string;
}
export class UserDto extends RegisterUserDto {
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
