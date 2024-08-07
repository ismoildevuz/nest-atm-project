import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoanSchedulesService } from './loan-schedules.service';
import { LoanSchedulesController } from './loan-schedules.controller';
import { LoanScheduleModel } from './loan-schedule.model';

@Module({
  imports: [SequelizeModule.forFeature([LoanScheduleModel])],
  controllers: [LoanSchedulesController],
  providers: [LoanSchedulesService],
})
export class LoanScheduleModule {}
