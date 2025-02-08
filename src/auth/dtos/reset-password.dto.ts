import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty({
    example: 'brian@bdcomputinglimited.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  useOTP: boolean;
}
