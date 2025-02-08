import { Global, Module } from '@nestjs/common';
import { GcsService } from './google-cloud-storage/services/gcs/gcs.service';
import { ConfigModule } from '@nestjs/config';
import { GCSStorageConfigService } from './google-cloud-storage/utils/storage.config';
import { GcsController } from './google-cloud-storage/controllers/gcs.controller';
import { fileManagerProviders } from './providers/providers';
import { FileManagerController } from './file-manager.controller';

const providers = [
  ...fileManagerProviders,
  GcsService,
  GCSStorageConfigService,
];
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [...providers],
  exports: [...providers],
  controllers: [GcsController, FileManagerController],
})
export class FileManagerModule {}
