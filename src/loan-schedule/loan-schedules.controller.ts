import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoanSchedulesService } from './loan-schedules.service';
import {
  LoanScheduleDtoGroup,
  LoanSchedulePagingDto,
} from './loan-schedule.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { MyValidationPipe } from '../pipes/validation.pipe';

@ApiTags('Loan Schedule')
@Controller('loan-schedule')
@ApiBearerAuth('user_auth')
@UseGuards(JwtAuthGuard)
export class LoanSchedulesController {
  constructor(private readonly loanSchedulesService: LoanSchedulesService) {}

  @Get()
  async findAll(
    @Query(new MyValidationPipe([LoanScheduleDtoGroup.PAGINATION]))
    query: LoanSchedulePagingDto,
  ) {
    return await this.loanSchedulesService.findAll(query);
  }
}
