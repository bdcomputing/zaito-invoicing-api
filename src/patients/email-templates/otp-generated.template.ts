/* eslint-disable prettier/prettier */
import { UserInterface } from 'src/users/interfaces/user.interface';
import { SettingsInterface } from 'src/settings/interfaces/settings.interface';
import { GenerateOTPDto } from 'src/otp/dto/generate-otp.dto';

export const OTPGeneratedTemplate = (
  settings: SettingsInterface,
  user: UserInterface,
  otp: GenerateOTPDto,
) => {
  const css = '';
  const template = `
  <div style="text-align: left;">
  <h1>Your One-Time Password (OTP)</h1>
  <p>Dear ${user.name},</p>
  <p>Your One-Time Password (OTP) for secure access to your account is:</p>
  <h3 class="otp" style="font-size: 46px; text-align: center;">[ ${otp.code} ]</h3>
  <p>Please use this OTP within the next 3 minutes to complete your action. Do not share this OTP with anyone for your security.</p>
  <p>If you did not request this OTP or have any concerns, please contact our support team immediately.</p>
  <p>Regards 
  <br> ${settings.general.company} Team
  </p>
  </div>
  `;

  return { template, css };
};
