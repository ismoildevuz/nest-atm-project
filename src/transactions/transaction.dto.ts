import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import { UserDto } from '../users/user.dto';
import { CardDto } from '../cards/card.dto';

export enum TransactionTypeEnum {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
  LOAN = 'loan',
}

export class TransactionDtoGroup {
  static readonly CREATE = 'CREATE';
  static readonly GET_BY_ID = 'GET_BY_ID';
  static readonly PAGINATION = 'PAGINATION';
}

export class TransactionDto {
  declare id: string;

  @ApiProperty({ type: 'string', example: TransactionTypeEnum.DEPOSIT })
  @IsEnum(TransactionTypeEnum, {
    groups: [TransactionDtoGroup.CREATE],
    message: `Transaction type enum values: ${Object.values(TransactionTypeEnum).join(', ')}`,
  })
  declare type: TransactionTypeEnum;

  @ApiProperty({ type: 'string', example: 500 })
  @IsNumber({ allowNaN: false }, { groups: [TransactionDtoGroup.CREATE] })
  @Min(0, { groups: [TransactionDtoGroup.CREATE] })
  declare amount: number;

  @ApiProperty({ type: 'string', example: '1234' })
  @IsString({ groups: [TransactionDtoGroup.CREATE] })
  @Length(4, 4, { groups: [TransactionDtoGroup.CREATE] })
  declare pin: string;

  @ApiProperty({ type: 'string', example: '12345678' })
  @IsUUID('4', { groups: [TransactionDtoGroup.CREATE] })
  declare cardId: string;

  declare card: CardDto;

  declare userId: string;

  declare user: UserDto;

  declare createdAt?: string;

  declare updatedAt?: string;

  declare deletedAt?: string;
}
