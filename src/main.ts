import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('PSYCHOLOGY APPLICATION')
    .setDescription('PSYCHOLOGY-BE API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
