import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../../../app.module';
import UserPermissionsSeeder from '../userPermissionsSeeder.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  await new UserPermissionsSeeder().run(dataSource);

  console.log('Seeder completed');

  await app.close();
}

bootstrap();
