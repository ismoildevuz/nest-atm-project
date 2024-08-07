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
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { LoanDto, LoanTypeEnum } from './loan.dto';
import { UserModel } from '../users/user.model';
import { UserDto } from '../users/dto/user.dto';
import { CardModel } from '../cards/card.model';
import { CardDto } from '../cards/card.dto';
import { TransactionModel } from '../transactions/transaction.model';
import { TransactionDto } from '../transactions/transaction.dto';
import { LoanScheduleModel } from '../loan-schedule/loan-schedule.model';
import { LoanScheduleDto } from '../loan-schedule/loan-schedule.dto';

@Table({ tableName: 'loans', underscored: true })
export class LoanModel extends Model<LoanDto, LoanDto> {
  @PrimaryKey
  @Column({ type: DataTypes.UUID })
  declare id: string;

  @Column({ type: DataTypes.STRING(32), allowNull: false })
  declare type: LoanTypeEnum;

  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  declare date: string;

  @Column({ allowNull: false })
  declare amount: number;

  @Column({ allowNull: false })
  declare period: number;

  @Column({ allowNull: false })
  declare rate: number;

  @Column({ defaultValue: false })
  declare closed: boolean;

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

  @HasOne(() => TransactionModel)
  declare transaction: TransactionDto;

  @HasMany(() => LoanScheduleModel)
  declare loanSchedules: LoanScheduleDto[];

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt?: string;

  @DeletedAt
  declare deletedAt?: string;
}
