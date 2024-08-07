import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { LoansService } from './loans.service';
import { LoanDtoGroup, LoanPagingDto } from './loan.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { MyValidationPipe } from '../pipes/validation.pipe';

@ApiTags('Loans')
@Controller('loans')
@ApiBearerAuth('user_auth')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get()
  async findAll(
    @Request() req: ExpressRequest,
    @Query(new MyValidationPipe([LoanDtoGroup.PAGINATION]))
    query: LoanPagingDto,
  ) {
    query.userId = req.user.id;
    return await this.loansService.findAll(query);
  }
}
