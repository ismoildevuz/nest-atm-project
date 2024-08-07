import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { CardDto } from '../../cards/card.dto';
import { TransactionDto } from '../../transactions/transaction.dto';
import { LoanDto } from '../../loans/loan.dto';

export class UserDtoGroup {
  static readonly REGISTER = 'register';
  static readonly LOGIN = 'login';
  static readonly UPDATE = 'UPDATE';
  static readonly GET_BY_ID = 'GET_BY_ID';
  static readonly PAGINATION = 'PAGINATION';
}

export class UserDto {
  @ApiProperty({ type: 'string', example: '12345678' })
  @IsUUID('4', { groups: [UserDtoGroup.UPDATE] })
  declare id: string;

  @ApiProperty({ type: 'string', example: '+998991234567' })
  @IsOptional({ groups: [UserDtoGroup.UPDATE] })
  @IsString({ groups: [UserDtoGroup.REGISTER, UserDtoGroup.UPDATE] })
  @Matches(/^\+998(90|91|93|94|95|98|99|33|88|97|71)(\d{3})(\d{2})(\d{2})$/, {
    groups: [UserDtoGroup.REGISTER, UserDtoGroup.UPDATE],
    message: 'Phone number must be in the format +998XXXXXXXXX',
  })
  declare phoneNumber: string;

  @ApiProperty({ type: 'string', example: 'password' })
  @IsOptional({ groups: [UserDtoGroup.UPDATE] })
  @IsString({ groups: [UserDtoGroup.REGISTER, UserDtoGroup.UPDATE] })
  declare password: string;

  @ApiProperty({ type: 'string', example: 'John' })
  @IsOptional({ groups: [UserDtoGroup.UPDATE] })
  @IsString({ groups: [UserDtoGroup.REGISTER, UserDtoGroup.UPDATE] })
  declare firstName: string;

  @ApiProperty({ type: 'string', example: 'Doe' })
  @IsOptional({ groups: [UserDtoGroup.UPDATE] })
  @IsString({ groups: [UserDtoGroup.REGISTER, UserDtoGroup.UPDATE] })
  declare lastName: string;

  declare cards: CardDto[];

  declare transactions: TransactionDto[];

  declare loans: LoanDto[];

  declare createdAt?: string;

  declare updatedAt?: string;

  declare deletedAt?: string;
}
