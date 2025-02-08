import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCompanyAccountDto {
  @IsString()
  @IsOptional()
  bankId?: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsBoolean()
  @IsNotEmpty()
  isBankAccount: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}

export class PostCompanyAccountDto extends CreateCompanyAccountDto {
  @IsString()
  @IsOptional()
  createdBy: string;
}
