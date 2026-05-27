import { Module } from '@nestjs/common';
import { PermissionmanagementService } from './service/permissionmanagement.service';
import { PermissionmanagementcontrollerController } from './controller/permissionmanagementcontroller.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [PermissionmanagementService],
  controllers: [PermissionmanagementcontrollerController],
})
export class PermissionmanagementModule {}
