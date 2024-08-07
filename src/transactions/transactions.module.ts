import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionModel } from './transaction.model';
import { CardModel } from '../cards/card.model';
import { LoanModel } from '../loans/loan.model';
import { LoanScheduleModel } from '../loan-schedule/loan-schedule.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      TransactionModel,
      CardModel,
      LoanModel,
      LoanScheduleModel,
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
