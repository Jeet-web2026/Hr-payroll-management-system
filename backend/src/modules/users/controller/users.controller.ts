import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../../comon/decorators/get-user.decorator';
import type { JwtUser } from '../../../comon/decorators/get-user.decorator';
import { UserResponseDto } from '../../../comon/dto/auth/userResponse.dto';
import { User } from '../models/user.entity';
import { PaginatedResponse } from '../../../comon/interfaces/paginatedDataresponse.interface';
import * as express from 'express';
import { plainToInstance } from 'class-transformer';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@GetUser() user: JwtUser): UserResponseDto {
    const userData = this.usersService.findById(user.id);
    return plainToInstance(UserResponseDto, userData, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/permissions')
  permissions() {
    return this.usersService.allPermissions();
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  allUsers(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('activity') activity: string,
    @Req() req: express.Request,
  ): Promise<PaginatedResponse<User>> {
    const user = req.user as any;
    return this.usersService.allUsers(page, limit, user.id, activity);
  }

  @Get('/:userId')
  @UseGuards(AuthGuard('jwt'))
  view(
    @Param('userId') userId: string,
    @Query('activity') activity: string,
  ): UserResponseDto {
    return plainToInstance(
      UserResponseDto,
      this.usersService.findById(userId),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @Put('/update/:userId')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('userId') userId: string,
    @Body() userData: Partial<User>,
  ): UserResponseDto {
    return plainToInstance(
      UserResponseDto,
      this.usersService.updateUser(userId, userData),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @Patch('/update/:userId')
  @UseGuards(AuthGuard('jwt'))
  edit(@Param('userId') userId: string, @Body() userData: Partial<User>) {
    return plainToInstance(
      UserResponseDto,
      this.usersService.updateUser(userId, userData),
      {
        excludeExtraneousValues: true,
      },
    );
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
