/* eslint-disable prettier/prettier */
import { User } from 'src/users/interfaces/user.interface';
import { Settings } from 'src/settings/interfaces/settings.interface';
import { OTP } from 'src/otp/interfaces/otp.interface';

export const AccountVerificationOTPTemplate = (
  settings: Settings,
  user: User,
  otp: OTP,
) => {
  const css = '';
  const template = `
  <div style="text-align: left;">
  <h3>Account Verification OTP</h3>
  <p>Dear ${user.name},</p>
  <p>Your One-Time Password (OTP) to verify your account is:</p>
  <h3 style="font-size: 46px; text-align: left;">[ ${otp.code} ]</h3>
  <p>Please use this OTP within the next 3 minutes to complete your action. Do not share this OTP with anyone for your security.</p>
  <p>If you did not request this OTP or have any concerns, please contact our support team immediately.</p>
  <p>Regards,
  <br> ${settings.general.company} Team
  </p>
  </div>
  `;

  return { template, css };
};
