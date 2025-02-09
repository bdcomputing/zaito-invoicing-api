import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceItemDto } from './invoice-item.dto';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  narration?: string;

  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @IsNotEmpty()
  @IsString()
  claimCode: string;

  @IsNotEmpty()
  @IsString()
  principalMember: string;

  @IsNotEmpty()
  @IsString()
  relationship: string;

  @IsNotEmpty()
  @IsString()
  coverNumber: string;

  @IsNotEmpty()
  @IsString()
  department: string;
}

export class PostInvoiceDto {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  narration?: string;

  @IsNotEmpty()
  @IsString()
  claimCode: string;

  @IsNotEmpty()
  @IsString()
  principalMember: string;

  @IsNotEmpty()
  @IsString()
  relationship: string;

  @IsNotEmpty()
  @IsString()
  coverNumber: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsNumber()
  subTotal: number;

  @IsNotEmpty()
  @IsNumber()
  vatAmount: number;

  @IsNotEmpty()
  @IsNumber()
  vatRate: number;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsString()
  @IsNumber()
  balance: number;
}
