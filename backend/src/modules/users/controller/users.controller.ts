import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../../comon/decorators/get-user.decorator';
import type { JwtUser } from '../../../comon/decorators/get-user.decorator';
import { UserResponseDto } from '../../../comon/dto/auth/userResponse.dto';
import { User } from '../model/user.entity';
import { PaginatedResponse } from '../../../comon/interfaces/paginatedDataresponse.interface';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@GetUser() user: JwtUser): Promise<UserResponseDto> {
    return this.usersService.findById(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  allUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<PaginatedResponse<User>> {
    return this.usersService.allUsers(page, limit);
  }
}
