import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { onlyJsonValidation } from './comon/middlewares/onlyJsonValidation.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(onlyJsonValidation);
  await app.listen(String(process.env.PORT));
}
bootstrap();
