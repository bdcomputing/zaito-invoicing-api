import { Injectable, Logger } from '@nestjs/common';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import { GCSStorageConfigService } from 'src/file-manager/google-cloud-storage/utils/storage.config';
import { GoogleStorageConfigInterface } from '../../interfaces/config.interface';
import { format } from 'util';
import { PassThrough } from 'stream';
@Injectable()
export class GcsService {
  private logger = new Logger(GcsService.name);

  private storage: Storage;
  private bucketName: string;
  /**
   * Creates an instance of FileUploadService.
   * @param {GCSStorageConfigService} storageConfigService
   * @memberof FileUploadService
   */
  constructor(private storageConfigService: GCSStorageConfigService) {
    this.prepareStorage();
  }

  async prepareStorage() {
    const storageConfig: GoogleStorageConfigInterface =
      await this.storageConfigService.getStorageConfig();
    this.storage = new Storage({
      projectId: storageConfig.googleProjectId, // Your Google Cloud project ID
      credentials: storageConfig.googleCredentials,
    });
    this.bucketName = storageConfig.mediaBucket || 'bdcomputinglimited-storage';
  }

  /**
   * Upload File to GCS
   *
   * @param {Express.Multer.File} originalFile
   * @return {*}  {Promise<any>}
   * @memberof FileUploadService
   */
  async uploadFile(originalFile: Express.Multer.File): Promise<any> {
    try {
      const bucket = this.storage.bucket(this.bucketName);

      const file = bucket.file(originalFile.originalname);
      const blobStream = fs.createReadStream(originalFile.path);

      await file.save(blobStream, {
        metadata: {
          contentType: originalFile.mimetype, // Set the content type as per your file type
        },
      });

      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${file.name}`,
      );

      // try {
      //   // Make the file public
      //   await bucket.file(originalFile.originalname).makePublic();
      // } catch {
      //   this.logger.log({
      //     message: `Uploaded the file successfully: ${originalFile.originalname}, but public access is denied!`,
      //     url: publicUrl,
      //   });
      // }

      const url = new URL(publicUrl);
      // Get the Signed URL for the uploaded file
      return url;
    } catch (error) {
      this.logger.error('file upload error', error);
    }
  }

  async uploadFileBuffer(originalFile: Express.Multer.File): Promise<any> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(originalFile.originalname);

      // Create a readable stream from the file buffer
      const blobStream = new PassThrough();
      blobStream.end(originalFile.buffer);

      await new Promise((resolve, reject) => {
        blobStream
          .pipe(
            file.createWriteStream({
              metadata: {
                contentType: originalFile.mimetype,
              },
              resumable: false, // Disable resumable uploads for buffer data
            }),
          )
          .on('error', reject)
          .on('finish', resolve);
      });

      // Create URL for direct file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${file.name}`,
      );

      try {
        // Make the file public
        await file.makePublic();
      } catch {
        this.logger.log({
          message: `Uploaded the file successfully: ${originalFile.originalname}, but public access is denied!`,
          url: publicUrl,
        });
      }

      // Return the public URL for the uploaded file
      return publicUrl;
    } catch (error) {
      this.logger.error('file upload error', error);
      throw error; // Re-throw the error to handle it in the caller function
    }
  }

  async getListFiles() {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const [files] = await bucket.getFiles();
      const fileInfos = [];

      files.forEach((file) => {
        fileInfos.push({
          name: file.name,
          url: file.metadata.mediaLink,
        });
      });
      return fileInfos;
    } catch (err) {
      this.logger.error(err);
      return err;
    }
  }

  async getFile(fileName: string): Promise<Buffer> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);
    const [data] = await file.download();
    return data;
  }

  async generateSignedUrl(fileName: string, expiry?: number): Promise<string> {
    const options = {
      version: 'v4', // Use v4 signatures
      action: 'read', // Allow reading the file
      expires: Date.now() + (expiry ? expiry : 15 * 60 * 1000), // URL expires in 15 minutes
    } as GetSignedUrlConfig;
    const [signedUrl] = await this.storage
      .bucket(this.bucketName)
      .file(fileName)
      .getSignedUrl(options);
    return signedUrl;
  }

  async getFilePublicUrl(fileName: string) {
    const bucket = this.storage.bucket(this.bucketName);

    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${fileName}`,
    );
    try {
      // Make the file public
      await bucket.file(fileName).makePublic();
    } catch {
      this.logger.error({
        message: `There was an error trying to make the document publicly accessible!`,
        url: publicUrl,
      });
    }
    return publicUrl;
  }
}
