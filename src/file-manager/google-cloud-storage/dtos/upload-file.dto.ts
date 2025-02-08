import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FileTypesEnum } from '../../enums/file-types.enum';

export class UploadFileToGCSDto {
  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsEnum(FileTypesEnum)
  @IsNotEmpty()
  type: FileTypesEnum;

  @IsOptional()
  documentsUploaded?: boolean;

  @IsOptional()
  @IsString()
  comments?: string;
}
