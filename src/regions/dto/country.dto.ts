import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsBoolean()
  @IsNotEmpty()
  supported: boolean;

  @IsString()
  @IsNotEmpty()
  mobileCode: string;
}
