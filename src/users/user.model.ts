import {
  Column,
  Model,
  PrimaryKey,
  HasMany,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { UserDto } from './dto/user.dto';
import { CardModel } from '../cards/card.model';
import { CardDto } from '../cards/card.dto';
import { TransactionModel } from '../transactions/transaction.model';
import { TransactionDto } from '../transactions/transaction.dto';
import { LoanModel } from '../loans/loan.model';
import { LoanDto } from '../loans/loan.dto';

@Table({ tableName: 'users', underscored: true })
export class UserModel extends Model<UserDto, UserDto> {
  @PrimaryKey
  @Column({ type: DataTypes.UUID })
  declare id: string;

  @Column({ allowNull: false, unique: true })
  declare phoneNumber: string;

  @Column({ allowNull: false })
  declare password: string;

  @Column({ allowNull: false })
  declare firstName: string;

  @Column({ allowNull: false })
  declare lastName: string;

  @HasMany(() => CardModel)
  declare cards: CardDto[];

  @HasMany(() => TransactionModel)
  declare transactions: TransactionDto[];

  @HasMany(() => LoanModel)
  declare loans: LoanDto[];

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt?: string;

  @DeletedAt
  declare deletedAt?: string;
}
