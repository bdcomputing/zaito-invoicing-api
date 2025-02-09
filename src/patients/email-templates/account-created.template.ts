/* eslint-disable prettier/prettier */
import { User } from 'src/users/interfaces/user.interface';
import { Settings } from 'src/settings/interfaces/settings.interface';

/**
 * Returns a template for a patient account created email notification.
 *
 * @param {Settings} settings - The application settings.
 * @param {User} user - The user to send the email to.
 *
 * @returns {Object} An object containing HTML and CSS for the email template.
 */
export const AccountCreatedPatientEmailTemplate = (
  settings: Settings,
  user: User,
) => {
  const css = '';
  const template = `
  <div style="text-align: left;">
  <h1>Welcome to ${settings.general.company}</h1>
  <p>Dear ${user.name},</p>
  <p>We are thrilled to welcome you to ${settings.general.company}, your trusted partner for all your dental clinic needs. Thank you for choosing us!</p>
  <p>Your account has been successfully created, and you are now a valued member of our dental clinic family. With ${settings.general.company}, you'll have access to a wide range of dental clinic products and services designed to provide you with peace of mind and financial security.</p>
  <p>If you have any questions, need assistance, or want to explore our dental clinic offerings, feel free to reach out to our dedicated patient support team. We're here to help you every step of the way.</p>
  <p> Use the following password to access your account ${user.password} for the first time. </p>
  <p>Once again, welcome to ${settings.general.company}. We look forward to serving you and ensuring your protection in the years to come.</p>
  <p>Best regards,
  <br>Your ${settings.general.company} Team</p>
  </div>
  `;

  return { template, css };
};
