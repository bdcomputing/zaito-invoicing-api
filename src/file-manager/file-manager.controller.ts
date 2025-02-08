import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GcsService } from './google-cloud-storage/services/gcs/gcs.service';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/authorization/guards/authorization.guard';
import { GenerateSignedURLDto } from './google-cloud-storage/dtos/gcs-file.dto';

@Controller('file-manager')
export class FileManagerController {
  constructor(private readonly gcsService: GcsService) {}

  @Get('')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async getAllFiles() {
    return await this.gcsService.getListFiles();
  }

  @Get('get-signed-link')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async generateSignedURL(@Body() body: GenerateSignedURLDto) {
    const { fileName } = body;
    return await this.gcsService.generateSignedUrl(fileName);
  }

  @Post('make-public')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async makeFilePublic(@Body() body: GenerateSignedURLDto) {
    const { fileName } = body;
    return await this.gcsService.getFilePublicUrl(fileName);
  }
}
