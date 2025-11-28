import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { join } from 'path';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpExceptionFilter } from './libs/exceptions/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Ottieni ConfigService
  const configService = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableShutdownHooks();
  app.enableCors();
  app.useStaticAssets({
    root: join(__dirname, '../public'),
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors
            .map((error) => Object.values(error.constraints as object))
            .flat(),
        );
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // ═══════════════════════════════════════════════════
  // Swagger Configuration (solo in development e test)
  // ═══════════════════════════════════════════════════
  const nodeEnv = configService.get<string>('app.nodeEnv') || 'development';
  const isDevelopmentOrTest = nodeEnv === 'development' || nodeEnv === 'test';

  if (isDevelopmentOrTest) {
    const config = new DocumentBuilder()
      .setTitle('NestJS DDD DevOps API')
      .setDescription('API documentation for NestJS DDD DevOps project')
      .setVersion('1.0')
      .setContact(
        'Your Name',
        'https://yourwebsite.com',
        'your.email@example.com',
      )
      .addServer('http://localhost:3000', 'Development server')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token from Keycloak or Supabase',
          in: 'header',
        },
        'JWT-auth', // Questo nome viene usato con @ApiBearerAuth('JWT-auth')
      )
      .addTag('Health', 'Health check endpoints')
      .addTag('Users', 'User management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'API Documentation',
      customfavIcon: 'https://nestjs.com/img/logo-small.svg',
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        persistAuthorization: true, // Mantiene il token tra i refresh
        tagsSorter: 'alpha', // Ordina i tag alfabeticamente
        operationsSorter: 'alpha', // Ordina gli endpoint alfabeticamente
      },
    });
  }

  const port = configService.get<number>('app.port');
  await app.listen(port!, '0.0.0.0');
}

bootstrap();
