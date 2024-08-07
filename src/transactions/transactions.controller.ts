import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { TransactionsService } from './transactions.service';
import {
  TransactionDto,
  TransactionDtoGroup,
  TransactionPagingDto,
} from './transaction.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { MyValidationPipe } from '../pipes/validation.pipe';

@ApiTags('Transactions')
@Controller('transactions')
@ApiBearerAuth('user_auth')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Request() req: ExpressRequest,
    @Body(new MyValidationPipe([TransactionDtoGroup.CREATE]))
    data: TransactionDto,
  ) {
    data.userId = req.user.id;
    return await this.transactionsService.create(data);
  }

  @Get()
  async findAll(
    @Request() req: ExpressRequest,
    @Query(new MyValidationPipe([TransactionDtoGroup.PAGINATION]))
    query: TransactionPagingDto,
  ) {
    query.userId = req.user.id;
    return await this.transactionsService.findAll(query);
  }
}
