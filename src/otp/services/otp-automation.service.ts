import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { OTPInterface } from '../interfaces/otp.interface';

@Injectable()
export class OtpAutomationService {
  private logger = new Logger(OtpAutomationService.name);
  constructor(
    @Inject(DatabaseModelEnums.OTP_MODEL) private otp: Model<OTPInterface>,
  ) {
    //
  }

  @OnEvent(SystemEventsEnum.OTP_USED, { async: true })
  async invalidateOTP(code: string) {
    try {
      await this.otp.findOneAndDelete({ code }).exec();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
