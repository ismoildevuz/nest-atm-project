import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardModel } from './card.model';

@Module({
  imports: [SequelizeModule.forFeature([CardModel])],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
