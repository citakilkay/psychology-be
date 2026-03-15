import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true });
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  // Set up global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Apply the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('PSYCHOLOGY APPLICATION')
    .setDescription('PSYCHOLOGY-BE API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI at /api route
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
