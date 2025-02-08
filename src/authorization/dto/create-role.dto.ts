import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DashboardEnums } from 'src/shared/enums/dashboard.enum';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Receptionist',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({
    example: 'admin',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(DashboardEnums)
  dashboard: DashboardEnums;

  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: ['create-user', 'update-user'],
    required: false,
  })
  @IsOptional()
  permissions: string[];
}

export class PostRoleDto {
  @ApiProperty({
    example: '4587fhjhfdjh45487',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  createdBy: string;
}
