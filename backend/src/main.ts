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
  await app.listen(String(process.env.PORT));
}
bootstrap();
