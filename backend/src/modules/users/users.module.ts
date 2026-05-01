import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { UsersController } from './controller/users.controller';
import { JwtStrategy } from '../../comon/strategies/jwt.strategies';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService, UsersModule],
  controllers: [UsersController],
})
export class UsersModule {}
