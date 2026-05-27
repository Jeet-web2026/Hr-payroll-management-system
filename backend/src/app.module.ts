import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './modules/mail/mail.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RequestModule } from './modules/request/request.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PermissionmanagementModule } from './modules/permissionmanagement/permissionmanagement.module';
import { PermissionmanagementService } from './modules/permissionmanagement/service/permissionmanagement.service';
import { PermissionmanagementcontrollerController } from './modules/permissionmanagement/controller/permissionmanagementcontroller.controller';

@Module({
  imports: [
    AuthModule,
    DashboardModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HealthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    MailModule,
    EventEmitterModule.forRoot(),
    RequestModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 1000 * 60 * 5,
    }),
    PermissionmanagementModule,
  ],
  controllers: [AppController, PermissionmanagementcontrollerController],
  providers: [AppService, PermissionmanagementService],
})
export class AppModule {}
