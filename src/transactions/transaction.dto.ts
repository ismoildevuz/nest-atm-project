import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { UserDto } from '../users/dto/user.dto';
import { CardDto } from '../cards/card.dto';
import { CardModel } from '../cards/card.model';
import { Transform, Type } from 'class-transformer';
import { LoanDto } from '../loans/loan.dto';

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

export class TransactionPagingDto {
  @ApiProperty({ type: 'number', example: 10, required: false })
  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { groups: [TransactionDtoGroup.PAGINATION] },
  )
  @Min(1, { groups: [TransactionDtoGroup.PAGINATION] })
  @Max(100, { groups: [TransactionDtoGroup.PAGINATION] })
  declare limit: number;

  @ApiProperty({ type: 'number', example: 1, required: false })
  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { groups: [TransactionDtoGroup.PAGINATION] },
  )
  @Min(1, { groups: [TransactionDtoGroup.PAGINATION] })
  declare page: number;

  @ApiProperty({
    type: 'enum',
    enum: TransactionTypeEnum,
    example: TransactionTypeEnum.DEPOSIT,
    required: false,
  })
  @IsOptional({ groups: [TransactionDtoGroup.PAGINATION] })
  @IsEnum(TransactionTypeEnum, {
    groups: [TransactionDtoGroup.PAGINATION],
    message: `Transaction type enum values: ${Object.values(TransactionTypeEnum).join(', ')}`,
  })
  declare type: TransactionTypeEnum;

  @ApiProperty({ type: 'string', example: null, required: false })
  @IsOptional({ groups: [TransactionDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [TransactionDtoGroup.PAGINATION] })
  declare transferCardId?: string;

  @ApiProperty({ type: 'string', example: null, required: false })
  @IsOptional({ groups: [TransactionDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [TransactionDtoGroup.PAGINATION] })
  declare cardId?: string;

  declare userId?: string;
}

export class TransactionDto {
  declare id: string;

  @ApiProperty({ type: 'string', example: TransactionTypeEnum.DEPOSIT })
  @IsEnum(TransactionTypeEnum, {
    groups: [TransactionDtoGroup.CREATE],
    message: `Transaction type enum values: ${Object.values(TransactionTypeEnum).join(', ')}`,
  })
  declare type: TransactionTypeEnum;

  @ApiProperty({ type: 'number', example: 1000 })
  @IsNumber({ allowNaN: false }, { groups: [TransactionDtoGroup.CREATE] })
  @Max(100000, { groups: [TransactionDtoGroup.CREATE] })
  @Min(1, { groups: [TransactionDtoGroup.CREATE] })
  declare amount: number;

  @ApiProperty({ type: 'string', example: '1234' })
  @IsString({ groups: [TransactionDtoGroup.CREATE] })
  @Length(4, 4, { groups: [TransactionDtoGroup.CREATE] })
  declare pin: string;

  declare loanId?: string;

  @ApiProperty({ type: LoanDto })
  @IsOptional({ groups: [TransactionDtoGroup.CREATE] })
  @ValidateNested({ groups: [TransactionDtoGroup.CREATE] })
  @Type(() => LoanDto)
  declare loan?: LoanDto;

  @ApiProperty({ type: 'string', example: '12345678' })
  @IsOptional({ groups: [TransactionDtoGroup.CREATE] })
  @IsUUID('4', { groups: [TransactionDtoGroup.CREATE] })
  declare transferCardId?: string;

  declare transferCard?: CardDto;

  declare transferCardModel?: CardModel;

  @ApiProperty({ type: 'string', example: '12345678' })
  @IsOptional({ groups: [TransactionDtoGroup.CREATE] })
  @IsUUID('4', { groups: [TransactionDtoGroup.CREATE] })
  declare cardId?: string;

  declare card?: CardDto;

  declare cardModel?: CardModel;

  declare userId: string;

  declare user: UserDto;

  declare createdAt?: string;

  declare updatedAt?: string;

  declare deletedAt?: string;
}
