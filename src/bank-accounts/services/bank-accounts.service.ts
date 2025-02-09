import { Inject, Injectable } from '@nestjs/common';
import {
  CreateBankAccountDto,
  PostBankAccountDto,
} from '../dto/create-bank-account.dto';
import {
  PostBankAccountUpdateDto,
  UpdateBankAccountDto,
} from '../dto/update-bank-account.dto';
import { Model } from 'mongoose';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { BankAccount } from '../interfaces/bank-accounts.interface';
import { DatabaseModelEnums } from '../../database/enums/database.enum';

@Injectable()
export class BankAccountsService {
  /**
   * Creates an instance of BankAccountsService.
   * @param {Model<BankAccount>} bankAccount
   * @memberof BankAccountsService
   */
  constructor(
    @Inject(DatabaseModelEnums.BANK_ACCOUNT_MODEL)
    private bankAccount: Model<BankAccount>,
  ) {}

  /**
   * Register a new BankAccount
   *
   * @param {CreateBankAccountDto} createBankAccountDto
   * @param {string} userId
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof BankAccountsService
   */
  async create(
    createBankAccountDto: CreateBankAccountDto,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const payload: PostBankAccountDto =
        createBankAccountDto as unknown as PostBankAccountDto;
      payload.createdBy = userId;
      const bankAccount = await this.bankAccount.create(createBankAccountDto);
      return new CustomHttpResponse(
        HttpStatusCodeEnum.CREATED,
        `The Bank Account ${createBankAccountDto.accountName} has been created successfully`,
        bankAccount,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        `There was an error creating the bank account ${createBankAccountDto.accountName}`,
        error,
      );
    }
  }

  async findAll(payload: { accountType?: string; holderId?: string }) {
    try {
      const { accountType, holderId } = payload;
      let bankAccounts;
      if (accountType || holderId) {
        bankAccounts = await this.bankAccount.find(payload).exec();
      } else {
        bankAccounts = await this.bankAccount.find().exec();
      }
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Bank Accounts found',
        bankAccounts,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an error getting the Bank Accounts',
        error,
      );
    }
  }

  async findOne(id: string) {
    try {
      const bankAccount = await this.bankAccount.findById(id);
      if (bankAccount) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.CREATED,
          `The bank account with id ${id} found`,
          bankAccount,
        );
      } else {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.NOT_FOUND,
          `The bank account with id ${id} not found`,
          null,
        );
      }
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        `There was an error getting the bank account with the id ${id}`,
        error,
      );
    }
  }
  /**
   * Update BankAccount
   *
   * @param {string} id
   * @param {UpdateBankAccountDto} updateBankAccountDto
   * @param {string} userId
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof bankAccountService
   */
  async update(
    id: string,
    updateBankAccountDto: UpdateBankAccountDto,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const filter = { _id: id };
      const payload: PostBankAccountUpdateDto =
        updateBankAccountDto as unknown as PostBankAccountUpdateDto;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdBy, ...update } = payload;
      // update the Bank Account
      const bankAccount = await this.bankAccount.findOneAndUpdate(
        filter,
        update,
        {
          returnOriginal: false,
        },
      );
      return new CustomHttpResponse(
        HttpStatusCodeEnum.CREATED,
        `Bank Account  updated successfully!`,
        bankAccount,
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
    return `This action removes a #${id} bank account`;
  }
}
