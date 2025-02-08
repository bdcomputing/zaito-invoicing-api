import { IsNotEmpty, IsString } from 'class-validator';
import { GCSFileResponseInterface } from '../interfaces/gcs-file.interface';
import { UploadFileToGCSDto } from './upload-file.dto';

export class FileUploadedResponseDto {
  @IsNotEmpty()
  metadata: GCSFileResponseInterface;

  @IsNotEmpty()
  payload: UploadFileToGCSDto;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
