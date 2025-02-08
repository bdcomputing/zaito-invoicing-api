import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BanksService } from '../services/banks.service';
import { CreateBankDto } from '../dto/create-bank.dto';
import { UpdateBankDto } from '../dto/update-bank.dto';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';
import { CustomHttpResponse } from 'src/shared';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  async create(
    @Body() createBankDto: CreateBankDto,
    @GenericResponse() res: GenericResponse,
    @Req() req: any,
  ) {
    const userId = req.user._id.toString();
    const response = await this.banksService.create(createBankDto, userId);
    res.setStatus(response.statusCode);
    return response;
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async getAllBanks(
    @GenericResponse() res: GenericResponse,
    @Query() query: ExpressQuery,
  ): Promise<CustomHttpResponse> {
    // Get all categories
    const response = await this.banksService.findAll(query);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  async findOne(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ) {
    const response = await this.banksService.findOne(id);
    res.setStatus(response.statusCode);
    return response;
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard)
  async update(
    @Param('id') id: string,
    @Body() updateBankDto: UpdateBankDto,
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ) {
    const userId: string = req.user._id.toString();
    const response = await this.banksService.update(id, updateBankDto, userId);
    res.setStatus(response.statusCode);

    return response;
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  remove(@Param('id') id: string) {
    return this.banksService.remove(id);
  }
}
