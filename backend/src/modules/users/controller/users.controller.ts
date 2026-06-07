import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../../comon/decorators/get-user.decorator';
import type { JwtUser } from '../../../comon/decorators/get-user.decorator';
import { UserResponseDto } from '../../../comon/dto/auth/userResponse.dto';
import { User } from '../model/user.entity';
import { PaginatedResponse } from '../../../comon/interfaces/paginatedDataresponse.interface';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import * as express from 'express';

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
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(25)
  allUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: express.Request,
  ): Promise<PaginatedResponse<User>> {
    const user = req.user as any;
    return this.usersService.allUsers(page, limit, user.id);
  }

  @Get('/:userId')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(25)
  view(@Param('userId') userId: string) {
    return this.usersService.findById(userId);
  }

  @Delete('/delete/:userId')
  @UseGuards(AuthGuard('jwt'))
  delete(
    @Param('userId') userId: string,
    @Query('permanentDelete') isPermanentdelete: string,
  ) {
    return this.usersService.delete(userId, isPermanentdelete);
  }
}
