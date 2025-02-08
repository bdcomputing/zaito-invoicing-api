import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class DefaultShippingAddressDto {
  @IsNotEmpty()
  @IsString()
  defaultShippingAddress: string;
}

export class PostDefaultShippingAddressStatusDto extends DefaultShippingAddressDto {
  @IsNotEmpty()
  @IsString()
  updatedBy: string;

  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;
}
