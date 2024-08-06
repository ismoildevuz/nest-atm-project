import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionModel } from './transaction.model';

@Module({
  imports: [SequelizeModule.forFeature([TransactionModel])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
