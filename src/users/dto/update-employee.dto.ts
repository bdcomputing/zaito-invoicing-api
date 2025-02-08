import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RegisterEmployeeDto } from './register-employee.dto';
import { PartialType } from '@nestjs/swagger';
import { GCSFileResponseInterface } from 'src/file-manager/google-cloud-storage/interfaces/gcs-file.interface';

export class UpdateEmployeeDto extends PartialType(RegisterEmployeeDto) {
  @IsOptional()
  signature?: GCSFileResponseInterface;
}

export class PostEmployeeUpdateDto extends UpdateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  updatedBy: string;

  @IsDate()
  @IsString()
  updatedDate: Date;
}
