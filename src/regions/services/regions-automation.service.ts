import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { CountryInterface } from '../interfaces/country.interface';
import { CountiesData } from '../data/countries.data';
import { CreateCountryDto } from '../dto/country.dto';

@Injectable()
export class RegionsAutomationService implements OnModuleInit {
  async onModuleInit() {
    await this.seed();
  }
  constructor(
    @Inject(DatabaseModelEnums.COUNTRY_MODEL)
    private countries: Model<CountryInterface>,
  ) {
    //
  }
  async seed() {
    // get all the countries
    const countries = await this.countries.find().exec();
    const defaultData = CountiesData;

    for (let i = 0; i < defaultData.length; i++) {
      const country: CreateCountryDto = defaultData[i] as CreateCountryDto;
      const found = countries.find((a) => a.code === country.code);

      if (!found) {
        await this.countries.create(country);
      } else {
        // this.logger.log('Account already exists');
        //TODO: Update the company accounts on the database
      }
    }
  }
}
