import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsStrongPassword,
  IsBoolean,
} from 'class-validator';

export class RegisterEmployeeDto {
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

  @IsString()
  @IsNotEmpty()
  role: string;
}

export class PostNewEmployeeDto extends RegisterEmployeeDto {
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @IsNotEmpty()
  @IsBoolean()
  isPasswordDefault: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isBackOfficeUser: boolean;

  @IsNotEmpty()
  @IsBoolean()
  phoneVerified: boolean;
}
