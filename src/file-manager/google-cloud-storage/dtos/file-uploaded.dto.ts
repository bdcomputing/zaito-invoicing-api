import { IsNotEmpty, IsString } from 'class-validator';
import { GCSFileResponse } from '../interfaces/gcs-file.interface';
import { UploadFileToGCSDto } from './upload-file.dto';

export class FileUploadedResponseDto {
  @IsNotEmpty()
  metadata: GCSFileResponse;

  @IsNotEmpty()
  payload: UploadFileToGCSDto;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
