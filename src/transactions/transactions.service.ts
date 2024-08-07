import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions } from 'sequelize';
import { randomUUID } from 'crypto';
import { compare } from 'bcrypt';
import { TransactionModel } from './transaction.model';
import {
  TransactionDto,
  TransactionPagingDto,
  TransactionTypeEnum,
} from './transaction.dto';
import { CardModel } from '../cards/card.model';
import { LoanDto } from '../loans/loan.dto';
import { LoanScheduleDto } from '../loan-schedule/loan-schedule.dto';
import { LoanModel } from '../loans/loan.model';
import { LoanScheduleModel } from '../loan-schedule/loan-schedule.model';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(TransactionModel) private model: typeof TransactionModel,
    @InjectModel(CardModel) private readonly cardModel: typeof CardModel,
    @InjectModel(LoanModel) private readonly loanModel: typeof LoanModel,
    @InjectModel(LoanScheduleModel)
    private readonly loanScheduleModel: typeof LoanScheduleModel,
  ) {}

  async create(data: TransactionDto) {
    if (data.type !== TransactionTypeEnum.LOAN && !data.cardId) {
      throw new BadRequestException({
        error: 'Card not given',
      });
    }
    if (data.type === TransactionTypeEnum.LOAN && !data.transferCardId) {
      throw new BadRequestException({
        error: 'Transfer card not given',
      });
    }
    const card = await this.cardModel.findOne({
      where: {
        id:
          data.type !== TransactionTypeEnum.LOAN
            ? data.cardId
            : data.transferCardId,
        userId: data.userId,
      },
      attributes: ['id', 'pin', 'balance', 'userId'],
    });
    if (!card) {
      throw new NotFoundException({
        error: `${data.type !== TransactionTypeEnum.LOAN ? 'Card' : 'Transfer card'} not found`,
      });
    }
    if (!(await compare(data.pin, card.dataValues.pin))) {
      throw new UnauthorizedException();
    }
    delete card.dataValues.pin;
    delete data.pin;
    if (data.type !== TransactionTypeEnum.LOAN) {
      if (data.type !== TransactionTypeEnum.TRANSFER && data.transferCardId) {
        delete data.transferCardId;
      }
      data.cardModel = card;
    } else {
      if (data.cardId) {
        delete data.cardId;
      }
      data.transferCardModel = card;
    }
    data.id = randomUUID();
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
      const transaction = await this.model.create(data, { transaction: tr });
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
    if (!data.transferCardId) {
      throw new BadRequestException({ error: 'Transfer card not given' });
    }
    if (data.transferCardId === data.cardId) {
      throw new BadRequestException({ error: 'Can not transfer to same card' });
    }
    if (data.cardModel.balance < data.amount) {
      throw new BadRequestException({ error: 'Not enough balance' });
    }
    const transferCard = await this.cardModel.findOne({
      where: { id: data.transferCardId },
      attributes: ['id', 'cardNumber', 'cardHolderName', 'balance', 'userId'],
    });
    if (!transferCard) {
      throw new NotFoundException({ error: 'Transfer card not found' });
    }
    const tr = await this.model.sequelize.transaction();
    try {
      data.cardModel.balance -= data.amount;
      transferCard.balance += data.amount;
      await data.cardModel.save({ transaction: tr });
      await transferCard.save({ transaction: tr });
      const transaction = await this.model.create(data, { transaction: tr });
      await tr.commit();
      const { id, type, amount, createdAt } = transaction.toJSON();
      if (data.cardModel.userId !== transferCard.userId) {
        delete transferCard.dataValues.balance;
      }
      delete transferCard.dataValues.userId;
      delete transferCard.dataValues.updatedAt;
      return {
        id,
        type,
        amount,
        balance: data.cardModel.balance,
        transferCard,
        createdAt,
      };
    } catch (error) {
      console.log(error);
      await tr.rollback();
      throw new InternalServerErrorException({ error });
    }
  }

  async loan(data: TransactionDto) {
    const { loan } = data;
    if (!loan) {
      throw new BadRequestException({ error: 'Loan info not given' });
    }
    const checkLoan = await this.loanModel.findOne({
      where: {
        closed: false,
        userId: data.userId,
      },
    });
    if (checkLoan) {
      throw new BadRequestException({ error: 'Already have loan' });
    }

    const tr = await this.model.sequelize.transaction();
    try {
      loan.id = randomUUID();
      loan.date = new Date(loan.date).toJSON();
      loan.amount = data.amount;
      loan.rate = Number(process.env.LOAN_INTEREST_RATE);
      loan.cardId = data.transferCardId;
      loan.userId = data.userId;
      data.loanId = loan.id;
      const loanSchedules = this.calculateLoanSchedules(loan);
      data.transferCardModel.balance += data.amount;
      await this.loanModel.create(loan, { transaction: tr });
      await this.loanScheduleModel.bulkCreate(loanSchedules, {
        transaction: tr,
      });
      await data.transferCardModel.save({ transaction: tr });
      const transaction = await this.model.create(data, { transaction: tr });
      await tr.commit();
      const { id, type, amount, createdAt } = transaction.toJSON();
      return {
        id,
        type,
        amount,
        balance: data.transferCardModel.balance,
        loan,
        loanSchedules,
        createdAt,
      };
    } catch (error) {
      console.log(error);
      await tr.rollback();
      throw new InternalServerErrorException({ error });
    }
  }

  calculateLoanSchedules(loan: LoanDto): LoanScheduleDto[] {
    const schedules: LoanScheduleDto[] = [];
    const monthlyRate = loan.rate / 12 / 100;
    const totalMonths = loan.period;
    if (loan.type === 'differentiate') {
      const mainDebtPerMonth = loan.amount / totalMonths;
      let remainingBalance = Number(loan.amount);
      for (let month = 1; month <= totalMonths; month++) {
        const date = new Date(loan.date);
        date.setUTCMonth(date.getUTCMonth() + month - 1);
        const payment = remainingBalance * monthlyRate + mainDebtPerMonth;
        const interest = remainingBalance * monthlyRate;
        remainingBalance = remainingBalance - mainDebtPerMonth;
        schedules.push({
          id: randomUUID(),
          date: date,
          payment: parseFloat(payment.toFixed(2)),
          mainDebt: parseFloat(mainDebtPerMonth.toFixed(2)),
          percent: parseFloat(interest.toFixed(2)),
          balance: parseFloat(remainingBalance.toFixed(2)),
          loanId: loan.id,
        });
      }
    } else if (loan.type === 'annuity') {
      const monthlyRate = loan.rate / 12 / 100;
      const totalMonths = loan.period;
      const payment =
        (monthlyRate * loan.amount) /
        (1 - Math.pow(1 + monthlyRate, -totalMonths));
      let remainingBalance = loan.amount;
      for (let month = 1; month <= totalMonths; month++) {
        const date = new Date(loan.date);
        date.setUTCMonth(date.getUTCMonth() + month - 1);
        const interest = remainingBalance * monthlyRate;
        const mainDebtPerMonth = payment - interest;
        remainingBalance -= mainDebtPerMonth;
        schedules.push({
          id: randomUUID(),
          date: date,
          payment: parseFloat(payment.toFixed(2)),
          mainDebt: parseFloat(mainDebtPerMonth.toFixed(2)),
          percent: parseFloat(interest.toFixed(2)),
          balance: parseFloat(remainingBalance.toFixed(2)),
          loanId: loan.id,
        });
      }
    }
    return schedules;
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
        {
          model: CardModel,
          as: 'transferCard',
          attributes: ['id', 'cardNumber', 'cardHolderName'],
        },
        {
          model: LoanModel,
          attributes: ['id', 'type', 'date', 'amount', 'period', 'rate'],
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
