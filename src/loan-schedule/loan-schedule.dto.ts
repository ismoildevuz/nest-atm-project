import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsUUID } from 'class-validator';
import { LoanDto } from '../loans/loan.dto';

export enum LoanScheduleTypeEnum {
  DIFFERENTIATE = 'differentiate',
  ANNUITY = 'annuity',
}

export class LoanScheduleDtoGroup {
  static readonly GET_BY_ID = 'GET_BY_ID';
  static readonly PAGINATION = 'PAGINATION';
}

export class LoanSchedulePagingDto {
  @ApiProperty({ type: 'boolean', example: null, required: false })
  @IsOptional({ groups: [LoanScheduleDtoGroup.PAGINATION] })
  @IsBooleanString({ groups: [LoanScheduleDtoGroup.PAGINATION] })
  declare closed?: string;

  @ApiProperty({ type: 'string', example: '123465789F', required: true })
  @IsUUID('4', { groups: [LoanScheduleDtoGroup.PAGINATION] })
  declare loanId: string;
}

export class LoanScheduleDto {
  declare id: string;

  declare date: Date;

  declare payment: number;

  declare mainDebt: number;

  declare percent: number;

  declare balance: number;

  declare closed?: boolean;

  declare loanId: string;

  declare loan?: LoanDto;

  declare createdAt?: string;

  declare updatedAt?: string;

  declare deletedAt?: string;
}
