import { AirtelMoneyService } from './../services/airtel-money.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { log } from 'console';
import { AirtelMoneyAuthService } from '../services/airtel-money-auth.service';

@ApiTags('Airtel Money')
@Controller('airtel-pay')
export class AirtelMoneyController {
  constructor(
    private readonly airtelMoneyAuthService: AirtelMoneyAuthService,
    private readonly airtelMoneyService: AirtelMoneyService,
  ) {}
  @Post('get-token')
  async getToken() {
    return this.airtelMoneyAuthService.getAccessToken();
  }

  @Post('stk-push')
  async initiateSTKPush(@Body() stkPayload: any) {
    log({ stkPayload });
  }
}
