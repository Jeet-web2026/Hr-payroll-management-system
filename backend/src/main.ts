import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { onlyJsonValidation } from './comon/middlewares/onlyJsonValidation.middleware';
import { ValidationPipe } from '@nestjs/common';
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
  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(String(process.env.PORT));
}
bootstrap();
