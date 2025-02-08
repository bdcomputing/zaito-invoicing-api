import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { log } from 'console';

@Injectable()
export class AirtelMoneyService {
  /**
   * Initiates an Airtel Money STK Push transaction
   * @param {any} stkPayload The STK push request data
   * @returns {Promise<any>} The response from the Airtel Money API
   * @throws {Error} if the request fails
   */
  async initiateSTKPush(stkPayload: any) {
    log({ stkPayload });
    const headers = {
      Accept: '*/* ',
      'Content-Type': 'application/json',
      'X-Country': 'UG',
      'X-Currency': 'UGX',
      Authorization: 'Bearer UC*******2w',
      ' x-signature': 'MGsp*****************Ag==',
      ' x-key': 'DVZC*******************NM=',
    };
    const body: any = {
      reference: 'Testing transaction',
      subscriber: {
        country: 'UG',
        currency: 'UGX',
        msisdn: '12****89',
      },
      transaction: {
        amount: 1000,
        country: 'UG',
        currency: 'UGX',
        id: 'random-unique-id',
      },
    };

    axios
      .post('https://openapiuat.airtel.africa/merchant/v2/payments/', body, {
        headers: headers,
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
