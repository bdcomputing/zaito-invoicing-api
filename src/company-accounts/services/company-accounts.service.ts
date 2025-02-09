import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { DefaultCompanyAccountsData } from 'src/company-accounts/data/default-company-accounts.data';
import {
  CreateCompanyAccountDto,
  PostCompanyAccountDto,
} from 'src/company-accounts/dto/create-company-account.dto';
import {
  UpdateCompanyAccountDto,
  PostCompanyAccountUpdateDto,
} from 'src/company-accounts/dto/update-company-account.dto';
import { CompanyAccount } from 'src/company-accounts/interfaces/company-account.interface';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class CompanyAccountsService {
  private logger = new Logger(CompanyAccountsService.name);

  /**
   * Creates an instance of CompanyAccountsService.
   * @param {Model<CompanyAccount>} companyAccounts
   * @memberof CompanyAccountsService
   */
  constructor(
    @Inject(DatabaseModelEnums.COMPANY_ACCOUNT_MODEL)
    private companyAccounts: Model<CompanyAccount>,
  ) {}

  @OnEvent(SystemEventsEnum.SyncDatabase, { async: true })
  async seed(userId: string) {
    const accounts = await this.companyAccounts.find().exec();
    const defaultData = DefaultCompanyAccountsData;

    for (let i = 0; i < defaultData.length; i++) {
      const acc: PostCompanyAccountDto = defaultData[
        i
      ] as PostCompanyAccountDto;
      acc.createdBy = userId;
      const found = accounts.find((a) => a.accountNumber === acc.accountNumber);

      if (!found) {
        await this.companyAccounts.create(acc);
      } else {
        this.logger.log('Account already exists');
        //TODO: Update the company accounts on the database
      }
    }
  }

  async create(
    createCompanyAccountDto: CreateCompanyAccountDto,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const payload: PostCompanyAccountDto =
        createCompanyAccountDto as unknown as PostCompanyAccountDto;
      payload.createdBy = userId;
      const companyAccount = await this.companyAccounts.create(
        createCompanyAccountDto,
      );
      return new CustomHttpResponse(
        HttpStatusCodeEnum.CREATED,
        `The Company Account ${createCompanyAccountDto.accountName} has been created successfully`,
        companyAccount,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        `There was an error creating the company account ${createCompanyAccountDto.accountName}`,
        error,
      );
    }
  }

  async findAll(query: ExpressQuery) {
    try {
      const search: any = query
        ? {
            isBankAccount: query.isBankAccount,
          }
        : {};
      let accounts;
      if (query && query.isBankAccount) {
        const aggregation: Array<any> = [
          {
            $addFields: {
              bnId: {
                $toObjectId: '$bankId',
              },
            },
          },
          {
            $lookup: {
              from: 'banks',
              localField: 'bnId',
              foreignField: '_id',
              as: 'bank',
            },
          },
          {
            $unwind: '$bank',
          },
        ];
        accounts = await this.companyAccounts.aggregate(aggregation).exec();
      } else {
        accounts = await this.companyAccounts.find({ ...search }).exec();
      }
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Company Accounts list found',
        accounts,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an error getting the company Accounts',
        error,
      );
    }
  }
  async findOne(id: string): Promise<CustomHttpResponse> {
    try {
      const account = await this.companyAccounts.findById(id).exec();
      if (account) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.CREATED,
          `The company Account with id ${id} found`,
          account,
        );
      } else {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.NOT_FOUND,
          `The company Account with id ${id} not found`,
          null,
        );
      }
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        `There was an error getting the company Account with the id ${id}`,
        error,
      );
    }
  }

  async update(
    id: string,
    updateCompanyAccountDto: UpdateCompanyAccountDto,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const filter = { _id: id };
      const payload: PostCompanyAccountUpdateDto =
        updateCompanyAccountDto as unknown as PostCompanyAccountUpdateDto;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdBy, ...update } = payload;
      // update the Company Account
      const companyAccount = await this.companyAccounts.findOneAndUpdate(
        filter,
        update,
        {
          returnOriginal: false,
        },
      );
      return new CustomHttpResponse(
        HttpStatusCodeEnum.CREATED,
        `Company Account updated successfully!`,
        companyAccount,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.CREATED,
        error.message,
        error,
      );
    }
  }

  remove(id: string) {
    return `This action removes a #${id} company account`;
  }
}
