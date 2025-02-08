import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class InvoiceItemDto {
  @IsNotEmpty()
  @IsString()
  item: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class PostInvoiceItemDto extends InvoiceItemDto {
  @IsNotEmpty()
  @IsString()
  invoiceId: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
