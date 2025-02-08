import { PartialType } from '@nestjs/swagger';
import { CreateBankDto } from './create-bank.dto';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBankDto extends PartialType(CreateBankDto) {}

export class PostUpdatedBankDto extends UpdateBankDto {
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @IsString()
  @IsNotEmpty()
  updatedBy: string;
}
