import { appName } from 'src/shared/constants/constants';
import { SettingsInterface } from '../interfaces/settings.interface';

/**
 * Returns the default application settings object.
 *
 * The returned object contains default values for:
 * - Branding (logos, favicon)
 * - Facebook app credentials
 * - General contact info
 * - Email server config
 * - App URL
 * - Backdating config
 * - Credit limit config
 */
export const defaultSettings = () => {
  const defaultSettings: SettingsInterface = {
    branding: {
      logo: '',
      darkLogo: '',
      favicon: '',
    },

    general: {
      app: appName,
      company: 'Zaito Medical Centre Limited',
      email: 'test@bdcomputinglimited.com',
      phone: '+254722968637',
      KRA: 'P89787878H',
      address: {
        boxAddress: '623',
        town: 'Eldoret',
        building: 'Rupa Mall',
        street: 'Uganda Road',
        country: 'Kenya',
        postalCode: '30100',
      },
    },
    // currencyConversionAgainst: [
    //   {
    //     currency: Currencies.KES,
    //     rate: 125,
    //   },
    // ],
    mail: {
      host: 'mail.bdcomputinglimited.com',
      port: 465,
      auth: {
        user: 'test@bdcomputinglimited.com',
        pass: 'Lc3128$%^&',
      },
      from: `${appName} <test@bdcomputinglimited.com>`,
    },
    appURL: 'http://localhost:4200',
  };
  return defaultSettings;
};
