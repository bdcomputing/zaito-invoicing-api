import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
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
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  confirmPassword: string;
}

export class UpdatePasswordWithOTPDto extends UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class UpdatePasswordWithTokenDto extends UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  resetPasswordToken: string;
}
