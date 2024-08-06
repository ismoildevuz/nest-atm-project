import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionModel } from './transaction.model';
import {
  TransactionDto,
  TransactionPagingDto,
  TransactionTypeEnum,
} from './transaction.dto';
import { compare } from 'bcrypt';
import { CardModel } from '../cards/card.model';
import { randomUUID } from 'crypto';
import { WhereOptions } from 'sequelize';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(TransactionModel) private model: typeof TransactionModel,
    @InjectModel(CardModel) private readonly cardModel: typeof CardModel,
  ) {}

  async create(data: TransactionDto) {
    const card = await this.cardModel.findOne({
      where: { id: data.cardId, userId: data.userId },
      attributes: ['id', 'pin', 'balance'],
    });
    if (!card) {
      throw new NotFoundException({
        error: 'Card not found',
      });
    }

    if (!(await compare(data.pin, card.dataValues.pin))) {
      throw new UnauthorizedException();
    }

    delete card.dataValues.pin;
    delete data.pin;
    data.id = randomUUID();
    data.cardModel = card;

    switch (data.type) {
      case TransactionTypeEnum.DEPOSIT:
        return await this.deposit(data);
      case TransactionTypeEnum.WITHDRAWAL:
        return await this.withdrawal(data);
      case TransactionTypeEnum.TRANSFER:
        return await this.transfer(data);
      case TransactionTypeEnum.LOAN:
        return await this.loan(data);
    }
  }

  async deposit(data: TransactionDto) {
    const tr = await this.model.sequelize.transaction();
    try {
      data.cardModel.balance += data.amount;
      await data.cardModel.save({ transaction: tr });
      const transaction = await this.model.create(data, { transaction: tr });
      await tr.commit();
      const { id, type, amount, createdAt } = transaction.toJSON();
      return { id, type, amount, balance: data.cardModel.balance, createdAt };
    } catch (error) {
      console.log(error);
      await tr.rollback();
      throw new InternalServerErrorException({ error });
    }
  }

  async withdrawal(data: TransactionDto) {
    if (data.cardModel.balance < data.amount) {
      throw new BadRequestException({ error: 'Not enough balance' });
    }

    const tr = await this.model.sequelize.transaction();
    try {
      data.cardModel.balance -= data.amount;
      await data.cardModel.save({ transaction: tr });
      const transaction = await this.model.create(data, {
        transaction: tr,
      });
      await tr.commit();
      const { id, type, amount, createdAt } = transaction.toJSON();
      return {
        id,
        type,
        amount,
        balance: data.cardModel.balance,
        createdAt,
      };
    } catch (error) {
      console.log(error);
      await tr.rollback();
      throw new InternalServerErrorException({ error });
    }
  }

  async transfer(data: TransactionDto) {
    if (data.cardModel.balance < data.amount) {
      throw new BadRequestException({ error: 'Not enough balance' });
    }

    const tr = await this.model.sequelize.transaction();
    try {
      data.cardModel.balance -= data.amount;
      await data.cardModel.save({ transaction: tr });
      const transaction = await this.model.create(data, {
        transaction: tr,
      });
      await tr.commit();
      const { id, type, amount, createdAt } = transaction.toJSON();
      return {
        id,
        type,
        amount,
        balance: data.cardModel.balance,
        createdAt,
      };
    } catch (error) {
      console.log(error);
      await tr.rollback();
      throw new InternalServerErrorException({ error });
    }
  }

  async loan(data: TransactionDto) {
    return data;
  }

  async findAll(query: TransactionPagingDto) {
    const filter: WhereOptions<TransactionDto> = { userId: query.userId };
    if (query.type) filter.type = query.type;
    if (query.cardId) filter.cardId = query.cardId;
    if (query.transferCardId) filter.transferCardId = query.transferCardId;

    const instance = await this.model.findAndCountAll({
      where: filter,
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'type', 'amount', 'createdAt'],
      include: [
        {
          model: CardModel,
          as: 'card',
          attributes: ['id', 'cardNumber', 'balance'],
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
