import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { UserDtoGroup } from './user.dto';

export class LoginDto {
  @ApiProperty({ type: 'string', example: '+998991234567' })
  @IsString({ groups: [UserDtoGroup.LOGIN] })
  @Matches(/^\+998(90|91|93|94|95|98|99|33|88|97|71)(\d{3})(\d{2})(\d{2})$/, {
    groups: [UserDtoGroup.LOGIN],
    message: 'Phone number must be in the format +998XXXXXXXXX',
  })
  declare phoneNumber: string;

  @ApiProperty({ type: 'string', example: 'password' })
  @IsString({ groups: [UserDtoGroup.LOGIN] })
  declare password: string;
}
