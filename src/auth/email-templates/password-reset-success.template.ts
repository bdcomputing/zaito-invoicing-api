/* eslint-disable prettier/prettier */
import { SettingsInterface } from 'src/settings/interfaces/settings.interface';
import { UserInterface } from 'src/users/interfaces/user.interface';

export const PasswordResetSuccessEmailTemplate = (
  settings: SettingsInterface,
  user: UserInterface,
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
