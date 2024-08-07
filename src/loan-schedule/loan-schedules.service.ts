import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions } from 'sequelize';
import { LoanScheduleModel } from './loan-schedule.model';
import { LoanScheduleDto, LoanSchedulePagingDto } from './loan-schedule.dto';
import { CardModel } from '../cards/card.model';
import { TransactionModel } from '../transactions/transaction.model';

@Injectable()
export class LoanSchedulesService {
  constructor(
    @InjectModel(LoanScheduleModel) private model: typeof LoanScheduleModel,
  ) {}

  async findAll(query: LoanSchedulePagingDto) {
    const filter: WhereOptions<LoanScheduleDto> = { loanId: query.loanId };
    if (query.closed) filter.closed = query.closed;
    const instance = await this.model.findAll({
      where: filter,
      order: [['date', 'ASC']],
      attributes: [
        'id',
        'date',
        'payment',
        'mainDebt',
        'percent',
        'balance',
        'closed',
        'createdAt',
      ],
      include: [
        {
          model: TransactionModel,
          attributes: ['id', 'type', 'amount'],
          include: [
            {
              model: CardModel,
              attributes: ['id', 'cardHolderName', 'cardNumber', 'balance'],
            },
          ],
        },
      ],
    });
    return instance;
  }
}
