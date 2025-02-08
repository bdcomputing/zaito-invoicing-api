import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InitiateSTKDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  accountReference: string;

  @IsString()
  @IsNotEmpty()
  transactionDesc: string;
}
