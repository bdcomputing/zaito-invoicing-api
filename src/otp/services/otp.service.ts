import { Inject, Injectable } from '@nestjs/common';
import { OTPInterface } from '../interfaces/otp.interface';
import { Model } from 'mongoose';
import {
  AccountVerificationCodeOTPDto,
  GeneratePasswordResetOTPDto,
} from '../dto/generate-otp.dto';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
@Injectable()
export class OtpService {
  /**
   * Creates an instance of OtpService.
   * @param {Model<OTPInterface>} otp
   * @memberof OtpService
   */
  constructor(
    @Inject(DatabaseModelEnums.OTP_MODEL) private otp: Model<OTPInterface>,
  ) {}

  async findById(id: string): Promise<OTPInterface> {
    return await this.otp.findById(id);
  }

  async generatePasswordResetOTP(data: {
    otp: GeneratePasswordResetOTPDto;
    userId: string;
  }): Promise<OTPInterface> {
    const { otp, userId } = data;
    const payload: any = otp as any;

    payload.createdBy = userId;
    return await this.otp.create(payload);
  }

  checkIfOTPExpired(otp: OTPInterface): boolean {
    return new Date().getTime() > +otp.expiry;
  }

  async saveAccountVerificationCode(data: {
    otp: AccountVerificationCodeOTPDto;
    userId: string;
  }): Promise<OTPInterface> {
    const { otp, userId } = data;
    const payload: any = otp as any;

    payload.createdBy = userId;
    return await this.otp.create(payload);
  }

  async findByCode(code: string): Promise<CustomHttpResponse> {
    try {
      const otp: OTPInterface | undefined = await this.otp
        .findOne({ code })
        .exec();

      // check if the otp is not there or if it is there and not active
      if (!otp || (otp && otp.isActive === false)) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.BAD_REQUEST,
          'The OTP code invalid',
          null,
        );
      }

      // check if expired
      const expired: boolean = this.checkIfOTPExpired(otp);

      if (expired) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.BAD_REQUEST,
          'The OTP code invalid',
          null,
        );
      }
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'OTP code valid',
        otp,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'The OTP code invalid',
        null,
      );
    }
  }
  /**
   * Update OTP
   *
   * @param {string} id
   * @param {*} payload
   * @param {string} userId
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof OtpService
   */
  async update(
    id: string,
    payload: any,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const filter = { _id: id };
      payload.updatedBy = userId;
      payload.updatedAt = new Date();
      const res = await this.otp.findOneAndUpdate(filter, payload, {
        returnOriginal: false,
      });
      return new CustomHttpResponse(
        HttpStatusCodeEnum.CREATED,
        'OTP updated successfully!',
        res,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }
}
