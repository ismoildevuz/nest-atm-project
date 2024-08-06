import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class MyValidationPipe implements PipeTransform<any> {
  constructor(groups = []) {
    this.groups = groups;
  }

  private groups: string[];

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value, {
      excludeExtraneousValues: false,
      groups: this.groups,
    });

    const errors = await validate(object, {
      groups: this.groups,
      whitelist: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException({ errors });
    }
    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
