import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BankBranchInterface } from '../interfaces/banks.interface';

export class CreateBankDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  branches?: BankBranchInterface[];

  @IsString()
  @IsOptional()
  bank_code?: string;
}

export class PostBankDto extends CreateBankDto {
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
