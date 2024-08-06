import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserDto } from './dto/user.dto';
import { UserModel } from './user.model';
import { JwtPayloadDto } from './dto/jwt.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel) private model: typeof UserModel,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: UserDto) {
    const checkUser = await this.findByPhoneNumber(data.phoneNumber, ['id']);
    if (checkUser) {
      throw new BadRequestException({
        error: 'Phone number already registered',
      });
    }
    const tr = await this.model.sequelize.transaction();
    try {
      data.id = randomUUID();
      data.password = await hash(data.password, 10);
      const user = this.model.build(data);
      await user.save({ transaction: tr });
      const tokens = await this.getTokens(user.toJSON());
      await tr.commit();
      return { ...user.toJSON(), ...tokens, password: undefined };
    } catch (error) {
      console.log(error);
      await tr.rollback();
      throw new InternalServerErrorException({ error });
    }
  }

  async login({ phoneNumber, password }: LoginDto) {
    const user = await this.findByPhoneNumber(phoneNumber, ['id', 'password']);
    if (!(user && (await compare(password, user.password)))) {
      throw new UnauthorizedException();
    }
    user.password = undefined;
    return await this.getTokens(user);
  }

  async findById(
    id: string,
    attributes: (keyof UserDto)[] = [
      'id',
      'firstName',
      'lastName',
      'phoneNumber',
      'balance',
    ],
  ) {
    return await this.model
      .findOne({
        where: { id },
        attributes: attributes,
      })
      .then((v) => v?.toJSON());
  }

  async findByPhoneNumber(
    phoneNumber: string,
    attributes: (keyof UserDto)[] = ['id', 'phoneNumber'],
  ) {
    return await this.model
      .findOne({
        where: { phoneNumber },
        attributes: attributes,
      })
      .then((v) => v?.toJSON());
  }

  async jwtSigIn(payload: JwtPayloadDto): Promise<string> {
    const options: JwtSignOptions = {
      secret: process.env.JWT_SECRET_ACCESS,
      expiresIn: process.env.JWT_EXPIRE_ACCESS,
    };
    return await this.jwtService.signAsync(payload, options);
  }

  private async getTokens(payload: JwtPayloadDto) {
    return {
      token: await this.jwtSigIn({
        id: payload.id,
      }),
    };
  }
}
