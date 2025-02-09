import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateBankDto, PostBankDto } from '../dto/create-bank.dto';
import { PostUpdatedBankDto, UpdateBankDto } from '../dto/update-bank.dto';
import { BanksData } from '../data/banks.data';
import { Bank, CreateBank } from '../interfaces/banks.interface';
import { Model } from 'mongoose';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { OnEvent } from '@nestjs/event-emitter';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { PrepareBankAggregation } from '../helpers/bank-aggregator.helper';
import { PaginatedData } from 'src/database/interfaces/paginated-data.interface';

@Injectable()
export class BanksService implements OnModuleInit {
  /**
   * Creates an instance of BanksService.
   * @param {Model<Bank>} banks
   * @memberof BanksService
   */
  constructor(
    @Inject(DatabaseModelEnums.BANK_MODEL) private banks: Model<Bank>,
  ) {}
  /**
   * This method is called by NestJS after the module has been initialized
   * and all controllers, providers, etc. have been registered.
   * We use this opportunity to seed the banks data into the database
   * with a default user (null) if no banks are found.
   * @return {Promise<void>}
   * @memberof BanksService
   */
  async onModuleInit() {
    await this.seed();
  }

  @OnEvent(SystemEventsEnum.SyncDatabase, { async: true })
  async seed(userId?: string) {
    const existingBanks: Bank[] = (await this.findAll()).data.data || [];
    const banks: CreateBank[] = BanksData || [];
    // Loop all the banks
    for (let i = 0; i < banks.length; i++) {
      const bank: CreateBank | undefined = banks[i];
      if (bank) {
        const bankExisting = existingBanks.find(
          (_bank: Bank) => _bank.name === bank.name,
        );
        if (!bankExisting) {
          await this.create(bank, userId);
        }
      }
    }
    return this.findAll();
  }
  async create(createBankDto: CreateBankDto, userId: string) {
    try {
      const payload: PostBankDto = createBankDto as any;
      payload.createdBy = userId;
      const bank = await this.banks.create(payload);
      return new CustomHttpResponse(
        HttpStatusCodeEnum.CREATED,
        `The Bank ${createBankDto.name} has been created successfully`,
        bank,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        `There was an error creating the bank ${createBankDto.name}`,
        error,
      );
    }
  }

  async findAll(query?: ExpressQuery): Promise<CustomHttpResponse> {
    try {
      const limitQ = (query && query.limit) || 50;
      const totalDocuments = (await this.banks.find().countDocuments()) || 0;
      let limit = +limitQ === -1 ? totalDocuments : +limitQ;
      const keyword = query && query.keyword ? query.keyword : '';
      const page = query && query.page ? +query.page : 1;
      const skip = limit * (page - 1);
      const sort =
        query && query.sort ? { ...(query.sort as any) } : { name: 1 };
      const full: boolean = query && query.full ? true : false;
      limit = full ? totalDocuments : limit;
      const aggregation = PrepareBankAggregation({
        keyword: keyword as string,
        sort,
        limit,
        skip,
      });

      const banks = await this.banks.aggregate(aggregation).exec();
      const counts = await this.banks
        .aggregate([...aggregation.slice(0, -2), { $count: 'count' }])
        .exec();

      const total = counts[0].count;

      const pages = Math.ceil(total / limit);

      const response: PaginatedData = {
        page,
        limit,
        total,
        data: banks,
        pages,
      };

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'All the banks have been loaded',
        response,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an issue loading the banks',
        error,
      );
    }
  }

  async findOne(id: string) {
    try {
      const bank = await this.banks.findById(id);
      if (bank) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.CREATED,
          `The Bank with id ${id} found`,
          bank,
        );
      } else {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.NOT_FOUND,
          `The Bank with id ${id} not found`,
          null,
        );
      }
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        `There was an error getting the bank with the id ${id}`,
        error,
      );
    }
  }

  /**
   *
   *
   * @param {string} id
   * @param {UpdateBankDto} updateBankDto
   * @param {string} userId
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof BanksService
   */
  async update(
    id: string,
    updateBankDto: UpdateBankDto,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const filter = { _id: id };
      const payload: PostUpdatedBankDto = updateBankDto as any;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();
      const res = await this.banks.findOneAndUpdate(filter, payload, {
        returnOriginal: false,
      });
      return new CustomHttpResponse(
        HttpStatusCodeEnum.CREATED,
        'Bank updated successfully!',
        res,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }

  remove(id: string) {
    return `This action removes a #${id} bank`;
  }
}
