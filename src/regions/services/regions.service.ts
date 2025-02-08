import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { CountryInterface } from '../interfaces/country.interface';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';

@Injectable()
export class RegionsService {
  constructor(
    @Inject(DatabaseModelEnums.COUNTRY_MODEL)
    private countries: Model<CountryInterface>,
  ) {
    //
  }

  async getSupportedCountries() {
    try {
      const aggregate: Array<any> = [
        {
          $match: {
            supported: true,
          },
        },
      ];
      const countries: CountryInterface[] = await this.countries
        .aggregate(aggregate)
        .exec();

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Loaded all the supported countries',
        countries,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an issue loading the supported countries',
        [],
      );
    }
  }

  async getAllCountries() {
    try {
      // const aggregate: Array<any> = [
      //   {
      //     $match: {
      //       supported: true,
      //     },
      //   },
      // ];
      const countries: CountryInterface[] = await this.countries.find().exec();

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Loaded all the countries',
        countries,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an issue loading the countries',
        [],
      );
    }
  }
}
