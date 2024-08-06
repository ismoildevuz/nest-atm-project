import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { CardDto } from '../cards/card.dto';
import { TransactionDto } from '../transactions/transaction.dto';

export class UserDtoGroup {
  static readonly CREATE = 'CREATE';
  static readonly UPDATE = 'UPDATE';
  static readonly GET_BY_ID = 'GET_BY_ID';
  static readonly PAGINATION = 'PAGINATION';
}

export class UserDto {
  @ApiProperty({ type: 'string', example: '12345678' })
  @IsUUID('4', { groups: [UserDtoGroup.UPDATE] })
  declare id: string;

  @ApiProperty({ type: 'string', example: 'username' })
  @IsOptional({ groups: [UserDtoGroup.UPDATE] })
  @IsString({ groups: [UserDtoGroup.CREATE, UserDtoGroup.UPDATE] })
  declare username: string;

  @ApiProperty({ type: 'string', example: 'password' })
  @IsOptional({ groups: [UserDtoGroup.UPDATE] })
  @IsString({ groups: [UserDtoGroup.CREATE, UserDtoGroup.UPDATE] })
  declare password: string;

  @ApiProperty({ type: 'string', example: 'John' })
  @IsOptional({ groups: [UserDtoGroup.UPDATE] })
  @IsString({ groups: [UserDtoGroup.CREATE, UserDtoGroup.UPDATE] })
  declare firstName: string;

  @ApiProperty({ type: 'string', example: 'Doe' })
  @IsOptional({ groups: [UserDtoGroup.UPDATE] })
  @IsString({ groups: [UserDtoGroup.CREATE, UserDtoGroup.UPDATE] })
  declare lastName: string;

  @ApiProperty({ type: 'string', example: '+998991234567' })
  @IsOptional({ groups: [UserDtoGroup.CREATE, UserDtoGroup.UPDATE] })
  @IsString({ groups: [UserDtoGroup.CREATE, UserDtoGroup.UPDATE] })
  declare phoneNumber?: string;

  declare balance?: string;

  declare cards: CardDto[];

  declare transactions: TransactionDto[];

  declare createdAt?: string;

  declare updatedAt?: string;

  declare deletedAt?: string;
}
