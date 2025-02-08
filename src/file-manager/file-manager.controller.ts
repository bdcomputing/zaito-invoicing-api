import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GcsService } from './google-cloud-storage/services/gcs/gcs.service';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { PermissionsGuard } from 'src/authorization/guards/permission.guard';
import { GenerateSignedURLDto } from './google-cloud-storage/dtos/gcs-file.dto';

@Controller('file-manager')
export class FileManagerController {
  constructor(private readonly gcsService: GcsService) {}

  @Get('')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  async getAllFiles() {
    return await this.gcsService.getListFiles();
  }

  @Get('get-signed-link')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  async generateSignedURL(@Body() body: GenerateSignedURLDto) {
    const { fileName } = body;
    return await this.gcsService.generateSignedUrl(fileName);
  }

  @Post('make-public')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  async makeFilePublic(@Body() body: GenerateSignedURLDto) {
    const { fileName } = body;
    return await this.gcsService.getFilePublicUrl(fileName);
  }
}
