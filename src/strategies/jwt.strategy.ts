import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayloadDto } from '../users/dto/jwt.dto';
import { IReqUserInterface } from '../users/dto/req.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_ACCESS,
    });
  }

  async validate(payload: JwtPayloadDto): Promise<IReqUserInterface> {
    const user = await this.usersService.findById(payload.id);
    if (user) return user as IReqUserInterface;
    throw new NotFoundException();
  }
}
