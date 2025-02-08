export enum PermissionEnum {
  // ADMINISTRATION
  SYNC_DATABASE = 'sync-database',
  // USERS
  CREATE_USER = 'create-user',
  VIEW_USER = 'view-user',
  UPDATE_USER = 'update-user',
  DELETE_USER = 'delete-user',
  UPDATE_USER_PERMISSIONS = 'update-user-permissions',

  CREATE_EMPLOYEE = 'create-employee',
  VIEW_EMPLOYEE = 'view-employee',
  VIEW_EMPLOYEES = 'view-employees',
  UPDATE_EMPLOYEE = 'update-employee',
  DELETE_EMPLOYEE = 'delete-employee',
  UPDATE_EMPLOYEE_PERMISSIONS = 'update-employee-permissions',

  // CLIENTS
  CREATE_CLIENT = 'create-client',
  VIEW_CLIENT = 'view-client',
  UPDATE_CLIENT = 'update-client',
  DELETE_CLIENT = 'delete-client',

  // SETTINGS
  VIEW_SETTINGS = 'view-settings',
  UPDATE_SETTINGS = 'update-settings',

  // ROLES
  CREATE_ROLE = 'create-role',
  VIEW_ROLE = 'view-role',
  UPDATE_ROLE = 'update-role',
  DELETE_ROLE = 'delete-role',

  // Clinics
  CREATE_CLINIC = 'create-clinic',
  VIEW_CLINIC = 'view-clinic',
  VIEW_CLINICS = 'view-clinics',
  UPDATE_CLINIC = 'update-clinic',
  DELETE_CLINIC = 'delete-clinic',

  // Clinics
  CREATE_PATIENT = 'create-patient',
  VIEW_PATIENT = 'view-patient',
  VIEW_PATIENTS = 'view-patients',
  UPDATE_PATIENT = 'update-patient',
  DELETE_PATIENT = 'delete-patient',

  // Bank Accounts
  CREATE_BANK_ACCOUNT = 'create-bank-account',
  VIEW_BANK_ACCOUNT = 'view-bank-account',
  VIEW_BANK_ACCOUNTS = 'view-bank-accounts',
  UPDATE_BANK_ACCOUNT = 'update-bank-account',
  DELETE_BANK_ACCOUNT = 'delete-bank-account',

  // Banks
  CREATE_BANK = 'create-bank',
  VIEW_BANK = 'view-bank',
  VIEW_BANKS = 'view-banks',
  UPDATE_BANK = 'update-bank',
  DELETE_BANK = 'delete-bank',

  // Company Accounts
  CREATE_COMPANY_ACCOUNT = 'create-company-account',
  VIEW_COMPANY_ACCOUNT = 'view-company-account',
  VIEW_COMPANY_ACCOUNTS = 'view-company-accounts',
  UPDATE_COMPANY_ACCOUNT = 'update-company-account',
  DELETE_COMPANY_ACCOUNT = 'delete-company-account',

  // Invoices
  CREATE_INVOICE = 'create-invoice',
  VIEW_INVOICE = 'view-invoice',
  VIEW_INVOICES = 'view-invoices',
  UPDATE_INVOICE = 'update-invoice',
  DELETE_INVOICE = 'delete-invoice',

  VIEW_TASK = 'view-task',
  CREATE_TASK = 'create-task',
  UPDATE_TASK = 'update-task',
  DELETE_TASK = 'delete-task',

  // PRODUCTS
  CREATE_PRODUCT = 'create-product',
  VIEW_PRODUCT = 'view-product',
  VIEW_PRODUCTS = 'view-products',
  UPDATE_PRODUCT = 'update-product',
  DELETE_PRODUCT = 'delete-product',
}

// export const PermissionEnums = {
//   ...DefaultPermissionsEnum,
//   ...ProductPermissionsEnum,
// };

// export type PermissionEnum = typeof PermissionEnums;
