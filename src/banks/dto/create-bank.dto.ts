import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BankBranch } from '../interfaces/banks.interface';

export class CreateBankDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  branches?: BankBranch[];

  @IsString()
  @IsOptional()
  bank_code?: string;
}

export class PostBankDto extends CreateBankDto {
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
