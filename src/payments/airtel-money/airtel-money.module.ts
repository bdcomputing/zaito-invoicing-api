import { Global, Module } from '@nestjs/common';
import { AirtelMoneyService } from './services/airtel-money.service';
import { AirtelMoneyController } from './controllers/airtel-money.controller';
import { airtelMoneyProviders } from './providers/airtel-money.provider';
import { AirtelMoneyAuthService } from './services/airtel-money-auth.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [AirtelMoneyController],
  providers: [
    ...airtelMoneyProviders,
    AirtelMoneyService,
    AirtelMoneyAuthService,
  ],
  exports: [...airtelMoneyProviders, AirtelMoneyService],
})
export class AirtelMoneyModule {}
