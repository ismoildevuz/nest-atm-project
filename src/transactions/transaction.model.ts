import {
  Column,
  Model,
  PrimaryKey,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { TransactionDto, TransactionTypeEnum } from './transaction.dto';
import { UserModel } from '../users/user.model';
import { UserDto } from '../users/user.dto';
import { CardModel } from '../cards/card.model';
import { CardDto } from '../cards/card.dto';

@Table({ tableName: 'transactions', underscored: true })
export class TransactionModel extends Model<TransactionDto, TransactionDto> {
  @PrimaryKey
  @Column({ type: DataTypes.UUID })
  declare id: string;

  @Column({ type: DataTypes.STRING(32), allowNull: false })
  declare type: TransactionTypeEnum;

  @Column({ allowNull: false })
  declare amount: number;

  @ForeignKey(() => CardModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  declare cardId: string;

  @BelongsTo(() => CardModel)
  declare card: CardDto;

  @ForeignKey(() => UserModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  declare userId: string;

  @BelongsTo(() => UserModel)
  declare user: UserDto;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt?: string;

  @DeletedAt
  declare deletedAt?: string;
}
