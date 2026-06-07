import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { UsersController } from './controller/users.controller';
import { JwtStrategy } from '../../comon/strategies/jwt.strategies';
import { UserEmployment } from './models/userEmplyment.entity';
import { UserDetails } from './models/userDetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserEmployment, UserDetails])],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService, UsersModule],
  controllers: [UsersController],
})
export class UsersModule {}
