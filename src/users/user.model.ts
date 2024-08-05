import {
  Column,
  Model,
  PrimaryKey,
  // HasMany,
  Table,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { UserDto } from './user.dto';

@Table({ tableName: 'users', underscored: true })
export class UserModel extends Model<UserDto, UserDto> {
  @PrimaryKey
  @Column({ type: DataTypes.UUID })
  declare id: string;

  @Column({ allowNull: false, unique: true })
  declare username: string;

  @Column({ allowNull: false })
  declare password: string;

  @Column({ allowNull: false })
  declare firstName: string;

  @Column({ allowNull: false })
  declare lastName: string;

  @Column
  declare phoneNumber: string;

  @Column
  declare balance: number;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt?: string;

  @DeletedAt
  declare deletedAt?: string;

  // @HasMany(() => CardModel)
  // declare cards: CardDto[];

  // @HasMany(() => TransactionModel)
  // declare transactions: TransactionDto[];
}
