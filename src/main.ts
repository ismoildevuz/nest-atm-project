import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { swaggerConfig } from './swagger';

async function bootstrap() {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule, {});

  app.use(cookieParser());

  app.enableCors({ origin: true, credentials: true });
  app.set('trust proxy', 'loopback');

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.HTTP_PORT, process.env.HTTP_HOST);
  console.log(`\x1b[33m\napp run on: ${await app.getUrl()} \x1b[0m`);
}

bootstrap();
