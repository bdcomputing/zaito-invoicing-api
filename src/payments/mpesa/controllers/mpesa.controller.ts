import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { MpesaEndpointName } from '../enums/constants';
import { MpesaApiService } from '../services/mpesa-api.service';
import { MpesaControllerRouteNames } from '../utils/routes.constants';
import { InitiateSTKDto } from '../dto/mpesa.dto';

@ApiTags('Mpesa Daraja API')
@ApiExcludeController()
@Controller(MpesaEndpointName)
export class MpesaController {
  /**
   * Creates an instance of MpesaController.
   * @param {MpesaApiService} mpesaService
   * @memberof MpesaController
   */
  constructor(private readonly mpesaService: MpesaApiService) {}
  /**
   * Initiate STK Push
   *
   * @param {} stkPushDto
   * @return {*}
   * @memberof MpesaController
   */
  @Post(MpesaControllerRouteNames.STK_PUSH)
  async initiateSTKPush(@Body() stkPushDto: InitiateSTKDto) {
    return this.mpesaService.initiateSTKPush(stkPushDto);
  }

  @Post(MpesaControllerRouteNames.PROCESS_CALLBACK)
  async processCallback(@Body() callbackData: any) {
    // Process the callback data asynchronously
    this.mpesaService
      .processCallbackDataAsync(callbackData)
      .catch(console.error);

    // Immediately return a response
    return { success: true, message: 'Callback queued for processing' };
  }

  // Endpoint to handle STK Push callback
  @Post(MpesaControllerRouteNames.CALLBACK)
  async handleSTKPushCallback(@Body() callbackData: any) {
    try {
      console.log('Callback received:', JSON.stringify(callbackData, null, 2));
      return await this.mpesaService.handleSTKPushCallback(callbackData);
    } catch (error) {
      console.error('Error handling callback:', error);
      throw error;
    }
  }

  // Endpoint to handle payment confirmation
  @Post(MpesaControllerRouteNames.CONFIRMATION)
  async handleConfirmation(@Body() confirmationData: any) {
    try {
      console.log(
        'Confirmation received:',
        JSON.stringify(confirmationData, null, 2),
      );
      return await this.mpesaService.handleConfirmation(confirmationData);
    } catch (error) {
      console.error('Error handling confirmation:', error);
      throw error;
    }
  }

  // Endpoint to handle payment validation
  @Post(MpesaControllerRouteNames.VALIDATION)
  async handleValidation(@Body() validationData: any) {
    try {
      console.log(
        'Validation request received:',
        JSON.stringify(validationData, null, 2),
      );
      return await this.mpesaService.handleValidation(validationData);
    } catch (error) {
      console.error('Error handling validation:', error);
      throw error;
    }
  }

  // @Get('transactions')
  // async getAllTransactions() {
  //   try {
  //     return await this.mpesaService.getAllMpesaTransactions();
  //   } catch (error) {
  //     console.error('Error getting all transactions:', error);
  //     throw error;
  //   }
  // }

  // @Get('transactions/filtered')
  // async getFilteredTransactions(
  //   @Query('phoneNumber') phoneNumber?: string,
  //   @Query('amount') amount?: number,
  //   @Query('isUsed') isUsed?: boolean,
  // ) {
  //   const parsedAmount = amount ? Number(amount) : undefined;
  //   const parsedIsUsed = isUsed ? isUsed === true : undefined;
  //   const transactions = await this.mpesaService.getFilteredTransactions(
  //     phoneNumber,
  //     parsedAmount,
  //     parsedIsUsed,
  //   );
  //   return transactions.map((transaction) => ({
  //     id: transaction.id, // Ensure the ID is included
  //     ...transaction,
  //   }));
  // }

  // @Patch('transactions/:transactionId/patient-name')
  // async savePatientName(
  //   @Param('transactionId') transactionId: string,
  //   @Body('patientName') patientName: string,
  // ) {
  //   await this.mpesaService.savePatientName(transactionId, patientName);
  //   return { message: 'Patient name saved successfully' };
  // }

  // @Get('transactions/successful')
  // async getSuccessfulTransactions() {
  //   return this.mpesaService.getSuccessfulTransactions();
  // }

  // New endpoint to get transactions for a specific day
  // @Get('transactions/daily')
  // async getTransactionsForDay(@Query('date') dateString: string) {
  //   try {
  //     const date = new Date(dateString);
  //     return await this.mpesaService.getTransactionsForDay(date);
  //   } catch (error) {
  //     console.error('Error getting transactions for day:', error);
  //     throw error;
  //   }
  // }
  // @Patch('transactions/:transactionId/mark-as-used')
  // async markTransactionAsUsed(@Param('transactionId') transactionId: string) {
  //   try {
  //     await this.mpesaService.markTransactionAsUsed(transactionId);
  //     return { message: 'Transaction marked as used successfully' };
  //   } catch (error) {
  //     console.error('Error marking transaction as used:', error);
  //     throw error;
  //   }
  // }

  // New endpoint to get all unused transactions
  // @Get('transactions/unused')
  // async getUnusedTransactions() {
  //   try {
  //     return await this.mpesaService.getUnusedTransactions();
  //   } catch (error) {
  //     console.error('Error getting unused transactions:', error);
  //     throw error;
  //   }
  // }

  @Get('transactions/query')
  async queryTransactions(
    @Query('startDate') startDateString: string,
    @Query('endDate') endDateString: string,
  ) {
    try {
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
      }

      const transactions = await this.mpesaService.queryTransactions(
        startDate,
        endDate,
      );
      return transactions;
    } catch (error) {
      console.error('Error querying transactions:', error);
      throw error;
    }
  }
}
