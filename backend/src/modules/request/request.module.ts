import { Module } from '@nestjs/common';
import { RequestController } from './controller/request.controller';
import { RequestService } from './service/request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './model/request.model';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Request]), UsersModule],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
