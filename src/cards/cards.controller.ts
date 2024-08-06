import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { CardsService } from './cards.service';
import { CardDto, CardDtoGroup } from './card.dto';
import { MyValidationPipe } from '../pipes/validation.pipe';
import { JwtAuthGuard } from '../guards/jwt.guard';

@ApiTags('Cards')
@Controller('cards')
@ApiBearerAuth('user_auth')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async create(
    @Request() req: ExpressRequest,
    @Body(new MyValidationPipe([CardDtoGroup.CREATE]))
    data: CardDto,
  ) {
    data.userId = req.user.id;
    data.cardHolderName = `${req.user.firstName.toUpperCase()} ${req.user.lastName.toUpperCase()}`;
    return await this.cardsService.create(data);
  }

  @Get()
  async findAll(@Request() req: ExpressRequest) {
    return await this.cardsService.findAll(req.user.id);
  }

  @Patch()
  async update(
    @Request() req: ExpressRequest,
    @Body(new MyValidationPipe([CardDtoGroup.UPDATE]))
    data: CardDto,
  ) {
    data.userId = req.user.id;
    return await this.cardsService.update(data);
  }
}
