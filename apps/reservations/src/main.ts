import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import * as CookieParser from 'cookie-parser';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.connectMicroservice({ transport: Transport.TCP });
  app.use(CookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
