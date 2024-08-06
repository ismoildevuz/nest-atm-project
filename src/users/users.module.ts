import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserModel } from './user.model';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_ACCESS,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_ACCESS },
    }),
    SequelizeModule.forFeature([UserModel]),
  ],
  controllers: [UsersController],
  providers: [JwtStrategy, UsersService],
})
export class UsersModule {}
