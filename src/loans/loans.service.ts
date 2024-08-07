import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LoanModel } from './loan.model';
import { LoanDto, LoanPagingDto } from './loan.dto';
import { CardModel } from '../cards/card.model';
import { WhereOptions } from 'sequelize';
import { TransactionModel } from '../transactions/transaction.model';

@Injectable()
export class LoansService {
  constructor(@InjectModel(LoanModel) private model: typeof LoanModel) {}

  async findAll(query: LoanPagingDto) {
    const filter: WhereOptions<LoanDto> = { userId: query.userId };
    if (query.type) filter.type = query.type;
    if (query.cardId) filter.cardId = query.cardId;
    const instance = await this.model.findAndCountAll({
      where: filter,
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'type',
        'date',
        'amount',
        'period',
        'rate',
        'createdAt',
      ],
      include: [
        {
          model: CardModel,
          attributes: ['id', 'cardNumber', 'balance'],
        },
        {
          model: TransactionModel,
          attributes: ['id', 'type', 'amount'],
        },
      ],
    });
    return {
      meta: {
        limit: query.limit,
        currentPage: query.page,
        totalPages: Math.ceil(instance.count / query.limit),
        totalCount: instance.count,
      },
      data: instance.rows,
    };
  }
}
