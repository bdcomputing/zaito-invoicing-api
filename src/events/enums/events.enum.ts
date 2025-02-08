import { AuthEventEnums } from 'src/auth/enums/auth.enums';
import { NotificationEventsEnum } from 'src/notifications/enums/notification.enum';
import { OTPEventEnums } from 'src/otp/enums/otp-events.enum';
import { PatientEvents } from 'src/patients/enums/patient.events';
import { TaskManagerEvents } from 'src/task-manager/enums/task-manager.events';

enum GeneralEventEnums {
  // System
  SendNewVersionOut = 'SendNewVersionOut',

  Sync = 'Sync',
  SyncDatabase = 'SyncDatabase',
  SyncDatabaseDone = 'SyncDatabaseDone',
  SyncPremium = 'SyncPremium',
  UpdateSequence = 'UpdateSequence',
  CompanyLogoUploaded = 'CompanyLogoUploaded',

  // User Accounts & Clinics
  SyncSuperUserAccount = 'SyncSuperUserAccount',
  SuperUserAccountCreated = 'SuperUserAccountCreated',
  UserAccountCreated = 'UserAccountCreated',
  EmployeeAccountCreated = 'EmployeeAccountCreated',

  // PATIENT

  // Expenses
  ExpenseCreated = 'ExpenseCreated',
  ExpenseUpdated = 'ExpenseUpdated',

  // Invoice
  InvoiceCreated = 'InvoiceCreated',
  InvoiceUpdated = 'InvoiceUpdated',
  PrepareCommission = 'PrepareCommission',
  InvoicePaid = 'InvoicePaid',

  // File
  FileUploaded = 'FileUploaded',

  // Policies
  RegisterPolicyNumber = 'RegisterPolicyNumber',
  AddAuthLog = 'AddAuthLog',
  CreateLogEntry = 'CreateLogEntry',
}

export const SystemEventsEnum = {
  ...AuthEventEnums,
  ...GeneralEventEnums,
  ...TaskManagerEvents,
  ...NotificationEventsEnum,
  ...PatientEvents,
  ...OTPEventEnums,
};

export type SystemEventsEnum = typeof SystemEventsEnum;
