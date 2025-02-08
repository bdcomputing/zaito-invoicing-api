import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInvoicePaymentDto {
  @IsNotEmpty()
  @IsString()
  receiptId: string;

  @IsNotEmpty()
  @IsOptional()
  narration?: string;

  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsString()
  invoiceId: string;

  @IsNotEmpty()
  @IsNumber()
  paidAmount: number;

  // @IsNotEmpty()
  // @IsNumber()
  // balance: number;

  @IsNotEmpty()
  @IsString()
  createdAt: string | Date;

  @IsNotEmpty()
  @IsString()
  createdBy: string;
}
