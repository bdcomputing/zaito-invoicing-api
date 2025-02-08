import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { BankAccountTypeEnum } from '../enums/bank-account-types.enum';

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  bankId: string;

  @IsString()
  @IsNotEmpty()
  holderId: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsEnum(BankAccountTypeEnum)
  @IsNotEmpty()
  accountType: string;
}

export class PostBankAccountDto extends CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
