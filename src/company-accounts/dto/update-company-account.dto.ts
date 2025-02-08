import { PartialType } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { PostCompanyAccountDto } from './create-company-account.dto';

export class UpdateCompanyAccountDto extends PartialType(
  PostCompanyAccountDto,
) {}

export class PostCompanyAccountUpdateDto extends UpdateCompanyAccountDto {
  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
