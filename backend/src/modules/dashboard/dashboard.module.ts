import { Module } from '@nestjs/common';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
