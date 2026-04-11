import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { onlyJsonValidation } from './comon/middlewares/onlyJsonValidation.middleware';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(onlyJsonValidation);
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
