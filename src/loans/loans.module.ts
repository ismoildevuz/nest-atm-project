import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { LoanModel } from './loan.model';

@Module({
  imports: [SequelizeModule.forFeature([LoanModel])],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
