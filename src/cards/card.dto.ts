import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { UserDto } from '../users/user.dto';
import { TransactionDto } from '../transactions/transaction.dto';

export class CardDtoGroup {
  static readonly CREATE = 'CREATE';
  static readonly UPDATE = 'UPDATE';
  static readonly GET_BY_ID = 'GET_BY_ID';
  static readonly PAGINATION = 'PAGINATION';
}

export class CardDto {
  @ApiProperty({ type: 'string', example: '12345678' })
  @IsUUID('4', { groups: [CardDtoGroup.UPDATE] })
  declare id: string;

  declare cardHolderName: string;

  declare cardNumber: string;

  declare expiryDate: string;

  declare cvv: string;

  @ApiProperty({ type: 'string', example: '1234' })
  @IsOptional({ groups: [CardDtoGroup.UPDATE] })
  @IsString({ groups: [CardDtoGroup.CREATE, CardDtoGroup.UPDATE] })
  @Length(4, 4, { groups: [CardDtoGroup.CREATE, CardDtoGroup.UPDATE] })
  declare pin: string;

  declare userId: string;

  declare user: UserDto;

  declare transactions: TransactionDto[];

  declare createdAt?: string;

  declare updatedAt?: string;

  declare deletedAt?: string;
}
