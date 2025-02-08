import { IsString, IsNotEmpty, IsPhoneNumber, IsEmail } from 'class-validator';
import { GCSFileResponseInterface } from '../interfaces/gcs-file.interface';
import { AddressInterface } from 'src/settings/interfaces/settings.interface';

export class UploadLogoToGCSDto {
  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  KRA: string;

  @IsNotEmpty()
  address: AddressInterface;
}
export class LogoUploadedResponseDto {
  @IsNotEmpty()
  metadata: GCSFileResponseInterface;

  @IsNotEmpty()
  payload: UploadLogoToGCSDto;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
