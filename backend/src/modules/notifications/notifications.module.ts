import { Module } from '@nestjs/common';
import { NotificationsController } from './controller/notifications.controller';
import { NotificationsService } from './services/notifications.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './models/notification.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Notification])],
  providers: [NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
