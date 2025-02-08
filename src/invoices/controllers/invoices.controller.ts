import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { CustomHttpResponse } from 'src/shared';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { InvoicesService } from '../services/invoices.service';
import { PermissionsGuard } from 'src/authorization/guards/permission.guard';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  /**
   * Create a Invoice
   *
   * @param {CreateInvoiceDto} createInvoiceDto
   * @param {*} req
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof InvoicesController
   */
  @Post()
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const userId: string = req.user._id.toString();
    const response = await this.invoicesService.create(
      createInvoiceDto,
      userId,
    );
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get all Invoices from the System
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof InvoicesController
   */
  @Get()
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  async findAll(
    @Query() query: ExpressQuery,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    // Get all invoices
    const response = await this.invoicesService.findAll(query);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get Invoice by ID
   *
   * @param {string} id
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof InvoicesController
   */
  @Get(':id')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  async findOne(
    @Param('id') invoiceId: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    // get invoice by id
    const response = await this.invoicesService.findOne(invoiceId);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update invoice by ID
   *
   * @param {string} id
   * @param {UpdateInvoiceDto} updateInvoiceDto
   * @param {*} req
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof InvoicesController
   */
  @Patch(':id')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const userId: string = req.user._id.toString();
    // Update invoice
    const response = await this.invoicesService.update({
      id,
      updateInvoiceDto,
      userId,
    });
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  remove(@Param('id') id: string) {
    // TODO: set response status code
    return this.invoicesService.remove(id);
  }
}
