import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true });
  const configService = app.get(ConfigService);

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