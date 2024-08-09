import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { TransactionsModule } from './transactions/transactions.module';
import { LoansModule } from './loans/loans.module';
import { LoanScheduleModule } from './loan-schedule/loan-schedules.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT || 5432),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      synchronize: true,
      logging: true,
      retryAttempts: 1,
      autoLoadModels: true,
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      pool: { min: 10, max: 30 },
    }),
    UsersModule,
    CardsModule,
    TransactionsModule,
    LoansModule,
    LoanScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
