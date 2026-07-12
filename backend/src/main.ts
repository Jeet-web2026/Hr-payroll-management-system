import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { onlyJsonValidation } from './comon/middlewares/onlyJsonValidation.middleware';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpExceptionFilter } from './comon/exceptions/http-exception.filter';
import { GlobalResponseInterceptor } from './comon/interceptors/globalSuccessResponse.interceptor';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  process.env.TZ = 'Asia/Kolkata';
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  app.use(onlyJsonValidation);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new GlobalResponseInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors) => {
        const errors: Record<string, string[]> = {};

        validationErrors.forEach((error) => {
          if (error.constraints) {
            errors[error.property] = Object.values(error.constraints);
          }
        });

        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors,
        });
      },
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });

  /*
  Swagger setup for API documentation.  
  */
  const apiUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000'
      : 'https://hr-payroll-management-system.onrender.com';

  const config = new DocumentBuilder()
    .setTitle('TeamHub API Documentation')
    .setDescription('API documentation for TeamHub application. Use this documentation to understand the available endpoints, request/response formats, and authentication requirements. Also use the base URL(' + apiUrl + ') for API requests based on the environment (development or production).')
    .setTermsOfService(`${apiUrl}/terms`)
    .setLicense('MIT License', 'https://github.com/twbs/bootstrap/blob/main/LICENSE')
    .addServer(apiUrl, 'Base URL for API requests')
    .setVersion('1.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(String(process.env.PORT));
}
bootstrap();
