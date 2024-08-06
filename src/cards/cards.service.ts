import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { randomUUID } from 'crypto';
import { hash } from 'bcrypt';
import { CardDto } from './card.dto';
import { CardModel } from './card.model';

@Injectable()
export class CardsService {
  constructor(@InjectModel(CardModel) private model: typeof CardModel) {}

  async create(data: CardDto) {
    const count = await this.model.count({ where: { userId: data.userId } });
    if (count >= 3) {
      throw new BadRequestException({ error: 'Total cards limit: 3' });
    }
    const tr = await this.model.sequelize.transaction();
    try {
      data.id = randomUUID();
      data.cardNumber = await this.generateCardNumber(tr);
      data.expiryDate = this.generateExpiryDate();
      data.cvv = this.generateRandomNumbers(3);
      data.pin = await hash(data.pin, 10);
      const card = this.model.build(data);
      await card.save({ transaction: tr });
      await tr.commit();
      return { ...card.toJSON(), pin: undefined };
    } catch (error) {
      console.log(error);
      await tr.rollback();
      throw new InternalServerErrorException({ error });
    }
  }

  async findAll(userId: string) {
    const cardInstances = await this.model.findAll({
      where: { userId },
      limit: 3,
      order: [['createdAt', 'ASC']],
      attributes: ['id', 'cardHolderName', 'cardNumber', 'expiryDate', 'cvv'],
    });
    return cardInstances;
  }

  async update(data: CardDto) {
    const card = await this.model.findOne({
      where: { id: data.id, userId: data.userId },
      attributes: ['id', 'cardHolderName', 'cardNumber', 'expiryDate', 'cvv'],
    });
    if (!card) {
      throw new NotFoundException();
    }
    const tr = await this.model.sequelize.transaction();
    try {
      data.pin = await hash(data.pin, 10);
      delete data.userId;
      await card.update(data, { transaction: tr });
      await tr.commit();
      return { ...card.toJSON(), pin: undefined };
    } catch (error) {
      console.log(error);
      await tr.rollback();
      throw new InternalServerErrorException({ error });
    }
  }

  async generateCardNumber(tr: Transaction): Promise<string> {
    const cardNumber = this.generateRandomNumbers(4, 4);
    const checkCard = await this.model.findOne({
      where: { cardNumber },
      transaction: tr,
    });
    if (!checkCard) {
      return cardNumber;
    }
    return await this.generateCardNumber(tr);
  }

  generateRandomNumbers(length = 1, repeat = 1) {
    let cardNumber = '';
    for (let i = 0; i < repeat; i++) {
      cardNumber += Math.floor(Math.random() * Math.pow(10, length))
        .toString()
        .padEnd(length, '0');
    }
    return cardNumber;
  }

  generateExpiryDate() {
    const date = new Date();
    return `${(date.getUTCMonth() + 1).toString().padStart(2, '0')}${((date.getUTCFullYear() % 100) + 2).toString().padStart(2, '0')}`;
  }
}
