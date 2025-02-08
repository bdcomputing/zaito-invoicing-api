import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MpesaService {
  private logger = new Logger(MpesaService.name);

  async saveMpesaTransaction(callback: any) {
    console.log(callback);

    return '';
  }
}
