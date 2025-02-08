import { MpesaService } from './mpesa.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { MpesaAuthService } from './mpesa-auth.service';
import { MpesaTransactionData } from '../interfaces/mpesaTransaction.interface';
import { mpesaConfig } from '../utils/mpesa.config';
import { MpesaRoutes } from '../utils/routes.constants';
import { InitiateSTKDto } from '../dto/mpesa.dto';
import { generateTimeStamp } from '../utils/timeStamp';

@Injectable()
export class MpesaApiService implements OnModuleInit {
  /**
   * Constructs the MpesaApiService
   *
   * @param mpesaAuthService The service to handle Mpesa Auth
   * @param mpesaService The service to handle Mpesa transactions
   */
  constructor(
    private readonly mpesaAuthService: MpesaAuthService,
    private readonly mpesaService: MpesaService,
  ) {}

  /**
   * Register C2B URLs on module initialization
   */
  async onModuleInit() {
    // Register C2B URLs on module initialization
    await this.mpesaAuthService.registerC2BUrls();
  }

  /**
   * Queries the status of an M-Pesa transaction
   *
   * @param transactionId The transaction ID to query
   * @returns The transaction status response
   * @throws Error if the request fails
   */
  async checkTransaction(transactionId: string): Promise<any> {
    const accessToken = await this.mpesaAuthService.getAccessToken();
    try {
      const response = await axios.post(
        `${mpesaConfig.baseURL}/${MpesaRoutes.transactionStatus}`,
        {
          Initiator: mpesaConfig.Initiator || 'api', // Replace with your actual initiator name
          SecurityCredential: mpesaConfig.SecurityCredential, // This should be an encrypted credential
          CommandID: 'TransactionStatusQuery',
          TransactionID: transactionId,
          PartyA: mpesaConfig.ShortCode,
          IdentifierType: '4',
          ResultURL: 'https://your-server.com/api/result', // Your actual result URL
          QueueTimeOutURL: 'https://your-server.com/api/timeout', // Your actual timeout URL
          Remarks: 'Check transaction',
          Occasion: 'Check',
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error('Failed to check M-Pesa transaction');
    }
  }

  /**
   * Initiates an M-Pesa STK Push transaction
   *
   * @param stkDto The STK push request data
   * @returns The response from the M-Pesa API
   * @throws Error if the request fails
   */
  async initiateSTKPush(stkDto: InitiateSTKDto): Promise<any> {
    const { phoneNumber, amount, accountReference, transactionDesc } = stkDto;
    const accessToken = await this.mpesaAuthService.getAccessToken();

    const Timestamp: string = generateTimeStamp();

    // generate password
    const password = Buffer.from(
      mpesaConfig.ShortCode + mpesaConfig.passkey + Timestamp,
    ).toString('base64');

    // format phone number
    const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);

    try {
      const response = await axios.post(
        `${mpesaConfig.baseURL}/${MpesaRoutes.stkPush}`,
        {
          BusinessShortCode: mpesaConfig.ShortCode,
          Password: password,
          Timestamp,
          TransactionType: 'PatientPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: mpesaConfig.ShortCode,
          PhoneNumber: formattedPhoneNumber,
          CallBackURL: `${mpesaConfig.callbackUrl}`,
          AccountReference: accountReference,
          TransactionDesc: transactionDesc,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log('STK Push response:', mpesaConfig.callbackUrl);
      return response.data;
    } catch (error) {
      console.error(
        'STK Push error:',
        error.response ? error.response.data : error.message,
      );
      throw new Error('Failed to initiate STK Push');
    }
  }

  /**
   * Process the callback data asynchronously
   *
   * @param callbackData The callback data received from M-Pesa
   */
  async processCallbackDataAsync(callbackData: any) {
    try {
      // Process the callback data
      await this.mpesaService.saveMpesaTransaction(callbackData);

      console.log('Callback processed successfully', callbackData);
    } catch (error) {
      console.error('Error processing callback:', error);
      // Implement retry logic or error reporting here
    }
  }

  /**
   * Format a phone number from the Safaricom format to the international E.164 format.
   * If the phone number starts with '07' or '01', strip the leading zero and prepend '254'.
   * Otherwise, return the phone number as is.
   *
   * @param phoneNumber The phone number to format
   * @return The formatted phone number
   */
  private formatPhoneNumber(phoneNumber: string): string {
    if (phoneNumber.startsWith('07') || phoneNumber.startsWith('01')) {
      return '254' + phoneNumber.slice(1);
    }
    return phoneNumber;
  }

  /**
   * Handles the callback data sent by M-Pesa when a transaction is completed.
   * The callback data is expected to be in the following format:
   * {
   *   "Body": {
   *     "stkCallback": {
   *       "MerchantRequestID": string,
   *       "CheckoutRequestID": string,
   *       "ResultCode": number,
   *       "ResultDesc": string,
   *       "CallbackMetadata": {
   *         "Item": [
   *           {
   *             "Name": string,
   *             "Value": string
   *           }
   *         ]
   *       }
   *     }
   *   }
   * }
   * The method saves the transaction data in the DB and returns a response
   * with the following structure:
   * {
   *   "success": boolean,
   *   "message": string,
   *   "data": {
   *     "transactionId": string
   *   }
   * }
   */
  async handleSTKPushCallback(callbackData: any): Promise<{
    success: boolean;
    message: string;
    data?: { transactionId: string };
  }> {
    console.log(
      'Received M-Pesa callback:',
      JSON.stringify(callbackData, null, 2),
    );

    // Check if callbackData is empty or undefined
    if (!callbackData || Object.keys(callbackData).length === 0) {
      console.error('Received empty or undefined callback data');
      return {
        success: false,
        message: 'Invalid callback data received',
      };
    }

    // Check if the expected structure exists
    if (!callbackData.Body || !callbackData.Body.stkCallback) {
      console.error('Callback data does not have the expected structure');
      return {
        success: false,
        message: 'Invalid callback data structure',
      };
    }

    const {
      ResultCode,
      ResultDesc,
      MerchantRequestID,
      CheckoutRequestID,
      CallbackMetadata,
    } = callbackData.Body.stkCallback;

    // Initialize transaction data object
    const transactionData: any = {
      merchantRequestID: MerchantRequestID,
      checkoutRequestID: CheckoutRequestID,
      resultCode: ResultCode,
      resultDesc: ResultDesc,
      amount: null,
      mpesaReceiptNumber: null,
      transactionDate: null,
      phoneNumber: null,
      isUsed: false,
    };

    if (ResultCode === 0 && CallbackMetadata) {
      // Extract additional transaction details from CallbackMetadata
      for (const item of CallbackMetadata.Item) {
        switch (item.Name) {
          case 'Amount':
            transactionData.amount = item.Value;
            break;
          case 'MpesaReceiptNumber':
            transactionData.mpesaReceiptNumber = item.Value;
            break;
          case 'TransactionDate':
            transactionData.transactionDate = new Date(
              `${item.Value.toString().slice(
                0,
                4,
              )}-${item.Value.toString().slice(
                4,
                6,
              )}-${item.Value.toString().slice(
                6,
                8,
              )}T${item.Value.toString().slice(
                8,
                10,
              )}:${item.Value.toString().slice(
                10,
                12,
              )}:${item.Value.toString().slice(12, 14)}`,
            );
            break;
          case 'PhoneNumber':
            transactionData.phoneNumber = item.Value.toString();
            break;
          default:
            break;
        }
      }

      console.log('Extracted transaction data:', transactionData);
    } else {
      console.log(`Failed M-Pesa transaction: ${ResultDesc}`);
    }

    try {
      const transactionId = await this.mpesaService.saveMpesaTransaction(
        transactionData,
      );

      return {
        success: ResultCode === 0,
        message: ResultDesc,
        data: { transactionId },
      };
    } catch (error) {
      console.error('Error saving transaction data:', error);
      return {
        success: false,
        message: 'Error processing transaction',
      };
    }
  }

  /**
   * Handles the confirmation data received from M-Pesa and processes it.
   *
   * Logs the confirmation data, extracts necessary transaction details,
   * and attempts to save the transaction using the MpesaService. Returns
   * a success message with the transaction ID if the saving process is
   * successful; otherwise, returns an error message.
   *
   * @param confirmationData The confirmation data received from M-Pesa.
   * @returns A promise that resolves to an object containing the success
   * status and a message.
   */
  async handleConfirmation(confirmationData: any): Promise<{
    success: boolean;
    message: string;
  }> {
    console.log(
      'Processing confirmation:',
      JSON.stringify(confirmationData, null, 2),
    );

    const transactionData: MpesaTransactionData = {
      merchantRequestID: confirmationData.MerchantRequestID,
      checkoutRequestID: confirmationData.CheckoutRequestID,
      resultCode: confirmationData.ResultCode,
      resultDesc: confirmationData.ResultDesc,
      amount: confirmationData.TransAmount,
      mpesaReceiptNumber: confirmationData.TransID,
      transactionDate: new Date(confirmationData.TransTime),
      phoneNumber: confirmationData.MSISDN.toString(),
      isUsed: false,
    };

    try {
      const transactionId = await this.mpesaService.saveMpesaTransaction(
        transactionData,
      );
      return {
        success: true,
        message: `Transaction saved successfully with ID: ${transactionId}`,
      };
    } catch (error) {
      console.error('Error saving confirmation data:', error);
      return {
        success: false,
        message: 'Error processing confirmation',
      };
    }
  }

  /**
   * Handles the validation data received from M-Pesa and processes it.
   *
   * Logs the validation data, and implements your custom validation logic
   * here. For this example, we'll assume validation is always successful.
   * Returns a promise that resolves to an object containing the success
   * status and a message.
   *
   * @param validationData The validation data received from M-Pesa.
   * @returns A promise that resolves to an object containing the success
   * status and a message.
   */
  async handleValidation(validationData: any): Promise<any> {
    console.log(
      'Processing validation:',
      JSON.stringify(validationData, null, 2),
    );

    // Implement your validation logic here
    // For this example, we'll assume validation is always successful

    return {
      ResultCode: 0,
      ResultDesc: 'Validation successful',
    };
  }

  /**
   * Retrieves all M-Pesa transactions from the database.
   *
   * @returns {Promise<{ id: string; data: MpesaTransactionData }[]>} A promise that resolves to an array of objects containing transaction IDs and data.
   */
  async getAllMpesaTransactions(): Promise<
    { id: string; data: MpesaTransactionData }[]
  > {
    try {
      const transactions: { id: string; data: MpesaTransactionData }[] = [];

      return transactions;
    } catch (error) {
      console.error('Error getting all transactions:', error);
      throw error;
    }
  }

  // New method to get transactions for a specific day
  // async getTransactionsForDay(date: Date){
  //   try {
  //     return await this.mpesaService.getMpesaTransactionsForDay(date);
  //   } catch (error) {
  //     console.error('Error getting transactions for day:', error);
  //     throw error;
  //   }
  // }

  // async savePatientName(
  //   transactionId: string,
  //   patientName: string,
  // ): Promise<void> {
  //   try {
  //     await this.mpesaService.updateMpesaTransaction(transactionId, {
  //       patientName,
  //     });
  //   } catch (error) {
  //     console.error('Error saving patient name:', error);
  //     throw error;
  //   }
  // }

  // async markTransactionAsUsed(transactionId: string): Promise<void> {
  //   console.log('Marking transaction as used:', transactionId);
  //   try {
  //     await this.mpesaService.updateMpesaTransaction(transactionId, {
  //       isUsed: true,
  //     });
  //   } catch (error) {
  //     console.error('Error marking transaction as used:', error);
  //     throw error;
  //   }
  // }

  // async getFilteredTransactions(
  //   phoneNumber?: string,
  //   amount?: number,
  //   isUsed?: boolean,
  // ): Promise<{ id: string; data: MpesaTransactionData }[]> {
  //   const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);

  //   try {
  //     let transactions = await this.getAllMpesaTransactions();

  //     if (formattedPhoneNumber) {
  //       transactions = transactions.filter(
  //         (t) => t.data.phoneNumber === formattedPhoneNumber,
  //       );
  //     }

  //     if (amount !== undefined) {
  //       transactions = transactions.filter((t) => t.data.amount === amount);
  //     }

  //     if (isUsed !== undefined) {
  //       transactions = transactions.filter((t) => t.data.isUsed === isUsed);
  //     }

  //     return transactions;
  //   } catch (error) {
  //     console.error('Error getting filtered transactions:', error);
  //     throw error;
  //   }
  // }

  // async getSuccessfulTransactions(){
  //   try {
  //     const transactions = await this.mpesaService.getAllMpesaTransactions();
  //     return transactions.filter((t) => t.resultCode === 0);
  //   } catch (error) {
  //     console.error('Error getting successful transactions:', error);
  //     throw error;
  //   }
  // }

  // New method to get all unused transactions
  // async getUnusedTransactions(){
  //   try {
  //     return await this.mpesaService.getUnusedMpesaTransactions();
  //   } catch (error) {
  //     console.error('Error getting unused transactions:', error);
  //     throw error;
  //   }
  // }

  private generateSecurityCredential(): string {
    try {
      const cert = fs.readFileSync(
        path.join(__dirname, '..', '..', 'certs', 'mpesa_cert.pem'),
        'utf8',
      );
      const initiatorPassword = mpesaConfig.consumerSecret;

      const encrypted = crypto.publicEncrypt(
        {
          key: cert,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(initiatorPassword),
      );

      return encrypted.toString('base64');
    } catch (error) {
      console.error('Error in generateSecurityCredential:', error);
      throw new Error('Failed to generate security credential');
    }
  }

  // Updated method to query transactions
  async queryTransactions(startDate: Date, endDate: Date): Promise<any> {
    const accessToken = await this.mpesaAuthService.getAccessToken();
    const securityCredential = this.generateSecurityCredential();

    try {
      const response = await axios.post(
        `${mpesaConfig.baseURL}/mpesa/transactionstatus/v1/query`,
        {
          Initiator: mpesaConfig.ShortCode, // Use shortcode as initiator name
          SecurityCredential: securityCredential,
          CommandID: 'TransactionStatusQuery',
          PartyA: mpesaConfig.ShortCode,
          IdentifierType: '4',
          ResultURL: `${mpesaConfig.callbackUrl}/transaction-status`,
          QueueTimeOutURL: `${mpesaConfig.callbackUrl}/timeout`,
          Remarks: 'Transaction Query',
          Occasion: 'TransactionCheck',
          TransactionID: '', // Leave empty to query all transactions
          OriginalConversationID: '', // Leave empty
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        'Failed to query M-Pesa transactions:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to query M-Pesa transactions');
    }
  }

  // Method to start periodic transaction check
  private startPeriodicTransactionCheck() {
    setInterval(() => this.checkAndSaveNewTransactions(), 60 * 60 * 1000); // Run every hour
  }

  private async checkAndSaveNewTransactions() {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 60 * 60 * 1000); // 1 hour ago

    try {
      const transactionData = await this.queryTransactions(startDate, endDate);
      if (
        transactionData &&
        transactionData.Result &&
        Array.isArray(transactionData.Result.ResultParameters)
      ) {
        for (const resultParam of transactionData.Result.ResultParameters) {
          if (resultParam.Key === 'TransactionReceipt') {
            await this.saveTransaction(resultParam.Value);
          }
        }
      } else {
        console.log('No new transactions found or unexpected response format');
      }
    } catch (error) {
      console.error('Error checking and saving new transactions:', error);
    }
  }

  // Update saveTransaction method to handle the new transaction format
  private async saveTransaction(transactionReceipt: string) {
    // You might need to query additional details about this transaction
    // using the Transaction Status API with this receipt number
    const transactionDetails = await this.checkTransaction(transactionReceipt);

    const transactionData: MpesaTransactionData = {
      merchantRequestID: transactionDetails.MerchantRequestID,
      checkoutRequestID: transactionDetails.CheckoutRequestID,
      resultCode: transactionDetails.ResultCode,
      resultDesc: transactionDetails.ResultDesc,
      amount: transactionDetails.Amount,
      mpesaReceiptNumber: transactionReceipt,
      transactionDate: new Date(transactionDetails.TransactionDate),
      phoneNumber: transactionDetails.PhoneNumber,
      isUsed: false,
      isDirectPayment: true, // Flag to indicate this was a direct payment
    };

    try {
      await this.mpesaService.saveMpesaTransaction(transactionData);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  }
}
