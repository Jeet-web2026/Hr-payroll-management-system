import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MailModule } from './modules/mail/mail.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RequestModule } from './modules/request/request.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PermissionmanagementModule } from './modules/permissionmanagement/permissionmanagement.module';
import { PermissionmanagementService } from './modules/permissionmanagement/service/permissionmanagement.service';
import { PermissionmanagementcontrollerController } from './modules/permissionmanagement/controller/permissionmanagementcontroller.controller';
import { BaseConfig } from './comon/configaration/config';

@Module({
  imports: [
    AuthModule,
    DashboardModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [BaseConfig],
    }),
    HealthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: configService.get<'postgres'>('database.type'),
        url: configService.get('database.dbUrl'),
        autoLoadEntities: configService.get<boolean>('database.autoloadEntities'),
        synchronize: configService.get<boolean>('database.synchronize'),
        ssl: {
          rejectUnauthorized: false,
        },
      }),
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
