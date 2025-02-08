import { Global, Module } from '@nestjs/common';
import { RegionsAutomationService } from './services/regions-automation.service';
import { countryProviders } from './providers/regions.provider';
import { RegionsController } from './controllers/regions.controller';
import { RegionsService } from './services/regions.service';

@Global()
@Module({
  providers: [RegionsAutomationService, ...countryProviders, RegionsService],
  exports: [RegionsAutomationService, ...countryProviders, RegionsService],
  controllers: [RegionsController],
})
export class RegionsModule {}
