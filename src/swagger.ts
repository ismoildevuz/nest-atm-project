import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .addBearerAuth(
    {
      type: 'http',
      name: 'Bearer auth',
      in: 'Moderator auth',
      description: 'Bearer token',
    },
    'user_auth',
  )
  .setTitle('API doc for ATM')
  .setDescription(':)')
  .setVersion('1.0.0')
  .build();
