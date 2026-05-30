import {
  Body,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../../comon/decorators/get-user.decorator';
import type { JwtUser } from '../../../comon/decorators/get-user.decorator';
import { UserResponseDto } from '../../../comon/dto/auth/userResponse.dto';
import { User, UserRole } from '../model/user.entity';
import { PaginatedResponse } from '../../../comon/interfaces/paginatedDataresponse.interface';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(50 * 10 * 1000)
  @UseGuards(AuthGuard('jwt'))
  getProfile(@GetUser() user: JwtUser): Promise<UserResponseDto> {
    return this.usersService.findById(user.id);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  allUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Body('role') role: UserRole,
  ): Promise<PaginatedResponse<User>> {
    return this.usersService.allUsers(page, limit, role);
  }
}
