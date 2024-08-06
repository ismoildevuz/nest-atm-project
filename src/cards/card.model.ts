import {
  Column,
  Model,
  PrimaryKey,
  HasMany,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { CardDto } from './card.dto';
import { UserModel } from '../users/user.model';
import { UserDto } from '../users/dto/user.dto';
import { TransactionModel } from '../transactions/transaction.model';
import { TransactionDto } from '../transactions/transaction.dto';

@Table({ tableName: 'cards', underscored: true })
export class CardModel extends Model<CardDto, CardDto> {
  @PrimaryKey
  @Column({ type: DataTypes.UUID })
  declare id: string;

  @Column({ type: DataTypes.STRING(32), allowNull: false })
  declare cardHolderName: string;

  @Column({ type: DataTypes.STRING(16), allowNull: false, unique: true })
  declare cardNumber: string;

  @Column({ type: DataTypes.STRING(4), allowNull: false })
  declare expiryDate: string;

  @Column({ type: DataTypes.STRING(4), allowNull: false })
  declare cvv: string;

  @Column({ type: DataTypes.STRING(4), allowNull: false })
  declare pin: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  declare userId: string;

  @BelongsTo(() => UserModel)
  declare user: UserDto;

  @HasMany(() => TransactionModel)
  declare transactions: TransactionDto[];

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt?: string;

  @DeletedAt
  declare deletedAt?: string;
}
