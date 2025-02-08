import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { FileUploadedResponseDto } from 'src/file-manager/google-cloud-storage/dtos/file-uploaded.dto';
import { UploadFileToGCSDto } from 'src/file-manager/google-cloud-storage/dtos/upload-file.dto';
import { FileTypesEnum } from 'src/file-manager/enums/file-types.enum';
import { CustomHttpResponse } from 'src/shared';
import { Response } from 'express';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { PermissionsGuard } from 'src/authorization/guards/permission.guard';
import { GCSFileResponseInterface } from 'src/file-manager/google-cloud-storage/interfaces/gcs-file.interface';
import { GcsService } from '../services/gcs/gcs.service';
import { toSentenceCase } from 'src/shared/helpers';

@Controller('files/gcs')
export class GcsController {
  private logger = new Logger(GcsController.name);

  /**
   * Creates an instance of GcsController.
   * @param {EventEmitter2} eventEmitter
   * @param {GcsService} gcsService
   * @memberof GcsController
   */
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly gcsService: GcsService,
  ) {}

  /**
   * Upload File to the server for now
   *
   * @param {Express.Multer.File} file
   * @return {*}
   * @memberof GcsController
   */
  @Post('upload')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // destination: './uploads',
        filename: (req, file, callback) => {
          const timestamp = `${new Date().getMilliseconds().toString()}`;

          const uniqueSuffix =
            timestamp + timestamp + '-' + Math.round(Math.random() * 1e9);

          const ext = extname(file.originalname);
          const fileName = `${uniqueSuffix}${ext}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UploadFileToGCSDto,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user._id.toString();
    // Upload the file to GCP
    const mediaLink = await this.gcsService.uploadFile(file);

    const metadata: GCSFileResponseInterface = {
      name: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      timeCreated: new Date(),
      originalName: file.originalname,
      encoding: file.encoding,
      fileName: file.filename,
      mediaLink,
    };

    // Create the response payload to send alongside the event being emitted
    const responsePayload: FileUploadedResponseDto = {
      metadata,
      payload,
      userId,
    };

    // Attach signature to an employee
    if (payload.type === FileTypesEnum.SIGNATURE) {
      // Emit event for logbook uploaded
      this.eventEmitter.emit(
        SystemEventsEnum.SignatureUploaded,
        responsePayload,
      );
    }
    // Attach logo to the settings
    if (payload.type === FileTypesEnum.COMPANY_LOGO) {
      // Emit event for logo uploaded
      this.eventEmitter.emit(
        SystemEventsEnum.CompanyLogoUploaded,
        responsePayload,
      );
    }

    const fileName = toSentenceCase(payload.type);
    // return the response back to the client
    return new CustomHttpResponse(
      HttpStatusCodeEnum.CREATED,
      fileName + ' Uploaded Successfully',
      metadata,
    );
  }

  @Get('')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  async getAllFiles() {
    return await this.gcsService.getListFiles();
  }

  @Get('signed-url/:fileName')
  async generateSignedUrl(
    @Param('fileName') fileName: string,
  ): Promise<{ url: string }> {
    try {
      const url = await this.gcsService.generateSignedUrl(fileName);
      return { url };
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Get('download/:fileName')
  async downloadFile(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const buffer = await this.gcsService.getFile(fileName);
      res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(buffer);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Post('upload-multiple')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() payload: UploadFileToGCSDto,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user._id.toString();

    // Array to store metadata of each uploaded file
    const metadataArray: GCSFileResponseInterface[] = [];

    // Upload each file and push its metadata to the array
    if (files && files.length) {
      for (const file of files) {
        const fileToUpload: any = file;
        fileToUpload.path = file.buffer;
        // Upload the file to GCP
        const mediaLink = await this.gcsService.uploadFileBuffer(fileToUpload);
        const fileName = file.originalname;
        // Create metadata object
        const metadata: GCSFileResponseInterface = {
          name: fileName,
          contentType: file.mimetype,
          size: file.size,
          timeCreated: new Date(),
          originalName: fileName,
          encoding: file.encoding,
          fileName: fileName,
          mediaLink,
        };

        // Push metadata to the array
        metadataArray.push(metadata);
      }
    }
    // Create the response payload to send alongside the event being emitted
    const responsePayload = {
      metadata: metadataArray,
      payload,
      userId,
    };

    // AdministrativeClaimDocumentsEnum
    // return the array of metadata back to the client
    return new CustomHttpResponse(
      HttpStatusCodeEnum.CREATED,
      'Files Uploaded Successfully',
      metadataArray,
    );
  }
}
