import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';


export function isDevEnvironment() {
  return process.env.APP_ENV === 'dev';
}

async function bootstrap() {
  const isDev = isDevEnvironment();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.enableCors();

  if (isDev) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Order Service API')
      .setDescription('The Orders Service Description')
      .setVersion('0.1')
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('api', app, swaggerDocument, {
      swaggerOptions: {
        persistAuthorization: true,
        operationsSorter: 'alpha',
      },
    });
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
