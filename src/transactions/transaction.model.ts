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
import { UserDto } from '../users/dto/user.dto';
import { CardModel } from '../cards/card.model';
import { CardDto } from '../cards/card.dto';
import { LoanModel } from '../loans/loan.model';
import { LoanDto } from '../loans/loan.dto';
import { LoanScheduleModel } from '../loan-schedule/loan-schedule.model';
import { LoanScheduleDto } from '../loan-schedule/loan-schedule.dto';

@Table({ tableName: 'transactions', underscored: true })
export class TransactionModel extends Model<TransactionDto, TransactionDto> {
  @PrimaryKey
  @Column({ type: DataTypes.UUID })
  declare id: string;

  @Column({ type: DataTypes.STRING(32), allowNull: false })
  declare type: TransactionTypeEnum;

  @Column({ allowNull: false })
  declare amount: number;

  @ForeignKey(() => LoanScheduleModel)
  @Column({ type: DataTypes.UUID })
  declare loanScheduleId?: string;

  @BelongsTo(() => LoanScheduleModel)
  declare loanSchedule?: LoanScheduleDto;

  @ForeignKey(() => LoanModel)
  @Column({ type: DataTypes.UUID })
  declare loanId?: string;

  @BelongsTo(() => LoanModel)
  declare loan?: LoanDto;

  @ForeignKey(() => CardModel)
  @Column({ type: DataTypes.UUID })
  declare transferCardId?: string;

  @BelongsTo(() => CardModel, 'transferCardId')
  declare transferCard?: CardDto;

  @ForeignKey(() => CardModel)
  @Column({ type: DataTypes.UUID })
  declare cardId?: string;

  @BelongsTo(() => CardModel, 'cardId')
  declare card?: CardDto;

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
