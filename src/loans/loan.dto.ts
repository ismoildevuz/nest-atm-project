import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { UserDto } from '../users/dto/user.dto';
import { CardDto } from '../cards/card.dto';
import { Transform } from 'class-transformer';
import { LoanScheduleDto } from '../loan-schedule/loan-schedule.dto';

export enum LoanTypeEnum {
  DIFFERENTIATE = 'differentiate',
  ANNUITY = 'annuity',
}

export class LoanDtoGroup {
  static readonly CREATE = 'CREATE';
  static readonly GET_BY_ID = 'GET_BY_ID';
  static readonly PAGINATION = 'PAGINATION';
}

export class LoanPagingDto {
  @ApiProperty({ type: 'number', example: 10, required: false })
  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { groups: [LoanDtoGroup.PAGINATION] },
  )
  @Min(1, { groups: [LoanDtoGroup.PAGINATION] })
  @Max(100, { groups: [LoanDtoGroup.PAGINATION] })
  declare limit: number;

  @ApiProperty({ type: 'number', example: 1, required: false })
  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { groups: [LoanDtoGroup.PAGINATION] },
  )
  @Min(1, { groups: [LoanDtoGroup.PAGINATION] })
  declare page: number;

  @ApiProperty({
    type: 'enum',
    enum: LoanTypeEnum,
    example: LoanTypeEnum.DIFFERENTIATE,
    required: false,
  })
  @IsOptional({ groups: [LoanDtoGroup.PAGINATION] })
  @IsEnum(LoanTypeEnum, {
    groups: [LoanDtoGroup.PAGINATION],
    message: `Loan type enum values: ${Object.values(LoanTypeEnum).join(', ')}`,
  })
  declare type: LoanTypeEnum;

  @ApiProperty({ type: 'string', example: null, required: false })
  @IsOptional({ groups: [LoanDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [LoanDtoGroup.PAGINATION] })
  declare cardId?: string;

  declare userId?: string;
}

export class LoanDto {
  declare id: string;

  @ApiProperty({ type: 'string', example: LoanTypeEnum.DIFFERENTIATE })
  @IsEnum(LoanTypeEnum, {
    groups: [LoanDtoGroup.CREATE],
    message: `Loan type enum values: ${Object.values(LoanTypeEnum).join(', ')}`,
  })
  declare type: LoanTypeEnum;

  @ApiProperty({ type: 'string', example: new Date() })
  @IsDateString(
    { strict: true, strictSeparator: true },
    { groups: [LoanDtoGroup.CREATE] },
  )
  declare date: string;

  declare amount?: number;

  @ApiProperty({ type: 'number', example: 12 })
  @IsNumber({ allowNaN: false }, { groups: [LoanDtoGroup.CREATE] })
  @Max(180, { groups: [LoanDtoGroup.CREATE] })
  @Min(1, { groups: [LoanDtoGroup.CREATE] })
  declare period: number;

  declare rate?: number;

  declare closed?: boolean;

  declare cardId?: string;

  declare card: CardDto;

  declare userId: string;

  declare user: UserDto;

  declare loanSchedules: LoanScheduleDto[];

  declare createdAt?: string;

  declare updatedAt?: string;

  declare deletedAt?: string;
}
