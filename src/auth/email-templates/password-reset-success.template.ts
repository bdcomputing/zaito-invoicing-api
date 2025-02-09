/* eslint-disable prettier/prettier */
import { Settings } from 'src/settings/interfaces/settings.interface';
import { User } from 'src/users/interfaces/user.interface';

export const PasswordResetSuccessEmailTemplate = (
  settings: Settings,
  user: User,
) => {
  const template = `
  <div style="text-align: left;">
  <p>Hello ${user.name},</p>
  <p>Your password was changed on <strong>${user.lastPasswordChange}</strong>.</p>
  <p>If you did not change your password yourself, please report to us so we can protect your account</p>
  <p>Thank you!</p>
  <br>Your ${settings.general.company} Team</p>
  </div>
  `;

  const css = '';

  return { template, css };
};
