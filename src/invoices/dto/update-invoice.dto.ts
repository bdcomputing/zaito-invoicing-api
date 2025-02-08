import { PartialType } from '@nestjs/swagger';
import { CreateInvoiceDto } from './create-invoice.dto';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
export class PostUpdatedInvoiceDto extends UpdateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
