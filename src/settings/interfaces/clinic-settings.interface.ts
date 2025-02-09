import { Branding, StorageSettings } from './settings.interface';

export interface ClinicSettings {
  clinicId: string;
  isMailCredentialsDefault: boolean;
  mail?: {
    port: number;
    auth: {
      user: string;
      pass: string;
    };
    host: string;
    from: string;
  };
  branding: Branding;
  appURL: string;
  storage?: StorageSettings;
  createdBy?: string;
}

export interface SystemSettings extends ClinicSettings {
  _id: string;
}
