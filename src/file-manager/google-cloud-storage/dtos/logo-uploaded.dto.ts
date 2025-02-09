import { IsString, IsNotEmpty, IsPhoneNumber, IsEmail } from 'class-validator';
import { GCSFileResponse } from '../interfaces/gcs-file.interface';
import { Address } from 'src/settings/interfaces/settings.interface';

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
  address: Address;
}
export class LogoUploadedResponseDto {
  @IsNotEmpty()
  metadata: GCSFileResponse;

  @IsNotEmpty()
  payload: UploadLogoToGCSDto;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
