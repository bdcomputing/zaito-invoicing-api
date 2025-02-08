import { Module } from '@nestjs/common';
import { MpesaController } from './controllers/mpesa.controller';
import { HttpModule } from '@nestjs/axios';
import { mpesaPaymentProviders } from './providers/mpesa.provider';
import { MpesaApiService } from './services/mpesa-api.service';
import { MpesaAuthService } from './services/mpesa-auth.service';
import { MpesaService } from './services/mpesa.service';

@Module({
  imports: [HttpModule],
  controllers: [MpesaController],
  providers: [
    ...mpesaPaymentProviders,
    MpesaApiService,
    MpesaAuthService,
    MpesaService,
  ],
})
export class MpesaModule {}
