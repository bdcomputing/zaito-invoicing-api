import { PartialType } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { PostBankAccountDto } from './create-bank-account.dto';

export class UpdateBankAccountDto extends PartialType(PostBankAccountDto) {}

export class PostBankAccountUpdateDto extends UpdateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
