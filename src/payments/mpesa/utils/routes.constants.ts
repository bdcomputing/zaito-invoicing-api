export const MpesaRoutes = {
  production: 'https://api.safaricom.co.ke',
  sandbox: 'https://sandbox.safaricom.co.ke',
  oauth: 'oauth/v1/generate?grant_type=client_credentials',
  b2c: 'mpesa/b2c/v1/paymentrequest',
  b2b: 'mpesa/b2b/v1/paymentrequest',
  c2bRegister: 'mpesa/c2b/v1/registerurl',
  c2bSimulate: 'mpesa/c2b/v1/simulate',
  accountBalance: 'mpesa/accountbalance/v1/query',
  transactionStatus: 'mpesa/transactionstatus/v1/query',
  reversal: 'mpesa/reversal/v1/request',
  stkPush: 'mpesa/stkpush/v1/processrequest',
  stkQuery: 'mpesa/stkpushquery/v1/query',
};

export const MpesaControllerRouteNames = {
  STK_PUSH: 'stk-push',
  PROCESS_CALLBACK: 'process-callback',
  CALLBACK: 'callback',
  CONFIRMATION: 'confirmation',
  VALIDATION: 'validation',
};
