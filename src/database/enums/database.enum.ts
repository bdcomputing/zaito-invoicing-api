import { AuthorizationDatabaseModelEnums } from 'src/authorization/enums/authorization-database-models.enum';

export enum DefaultDatabaseModelEnums {
  DATABASE_CONNECTION = 'DATABASE_CONNECTION',
  COMMISSION_MODEL = 'Commission',
  BANK_MODEL = 'Banks',
  BANK_ACCOUNT_MODEL = 'Bank_Accounts',
  COMPANY_ACCOUNT_MODEL = 'Company_Accounts',

  INVOICE_MODEL = 'Invoices',
  INVOICE_ITEM_MODEL = 'invoice_item',
  RECEIPTS_MODEL = 'Receipts',
  OTP_MODEL = 'OTP_Codes',
  MPESA_MODEL = 'Mpesa_Payments',
  COUNTRY_MODEL = 'Countries',
  AIRTEL_MONEY_MODEL = 'Airtel_Money_Payments',
  TASKS_MODEL = 'Tasks',
  SETTING_MODEL = 'Settings',
  CLINIC_SETTING_MODEL = 'Clinic_Settings',
  USER_MODEL = 'Users',
  AUTH_LOG_MODEL = 'Auth_Logs',
  PATIENT_MODEL = 'Patients',
  SEQUENCE_MODEL = 'Sequence',

  // Files
  FILE_MANAGER_MODEL = 'File_Manager',

  // REPORTS
  REPORTS_MODEL = 'Reports',

  // REPORTS
  LOG_MODEL = 'Logs',
}

export const DatabaseModelEnums = {
  ...DefaultDatabaseModelEnums,
  ...AuthorizationDatabaseModelEnums,
};

export type DatabaseModelEnums = typeof DatabaseModelEnums;
