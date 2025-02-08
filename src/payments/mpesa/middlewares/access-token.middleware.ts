import { MpesaAuthService } from './../services/mpesa-auth.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

@Injectable()
export class MpesaAccessTokenMiddleware implements NestMiddleware {
  constructor(private readonly mpesaAuthService: MpesaAuthService) {}

  async use(req: any, res: Response, next: NextFunction) {
    const access_token: any = await this.mpesaAuthService.getAccessToken();
    req.mpesaAccessToken = access_token;
    next();
  }
}
