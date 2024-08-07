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
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { LoanScheduleDto } from './loan-schedule.dto';
import { TransactionModel } from '../transactions/transaction.model';
import { TransactionDto } from '../transactions/transaction.dto';
import { LoanModel } from '../loans/loan.model';
import { LoanDto } from '../loans/loan.dto';

@Table({ tableName: 'loan_schedule', underscored: true })
export class LoanScheduleModel extends Model<LoanScheduleDto, LoanScheduleDto> {
  @PrimaryKey
  @Column({ type: DataTypes.UUID })
  declare id: string;

  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  declare date: Date;

  @Column({ allowNull: false })
  declare payment: number;

  @Column({ allowNull: false })
  declare mainDebt: number;

  @Column({ allowNull: false })
  declare percent: number;

  @Column({ allowNull: false })
  declare balance: number;

  @Column({ defaultValue: false })
  declare closed: boolean;

  @ForeignKey(() => LoanModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  declare loanId: string;

  @BelongsTo(() => LoanModel)
  declare loan: LoanDto;

  @HasOne(() => TransactionModel)
  declare transaction: TransactionDto;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt?: string;

  @DeletedAt
  declare deletedAt?: string;
}
