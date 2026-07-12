import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../../comon/decorators/get-user.decorator';
import type { JwtUser } from '../../../comon/decorators/get-user.decorator';
import { UserResponseDto } from '../../../comon/dto/auth/userResponse.dto';
import { User, UserRole } from '../models/user.entity';
import { PaginatedResponse } from '../../../comon/interfaces/paginatedDataresponse.interface';
import * as express from 'express';
import { plainToInstance } from 'class-transformer';
import { AddUserFromAdmin } from '../../../comon/dto/admin/add-user.dto';
import { Role } from '../../../comon/decorators/roles.decorator';
import { RolesGuard } from '../../../comon/guards/roles.guard';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User Management')
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
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'activity',
    required: false,
    description:
      'Filter users by activity status (e.g., permission-management)',
    example: 'permission-management',
  })
  @ApiOperation({
    summary:
      'Get all users with pagination and optional activity filter for permission management or newly joined users based on authenticated user role.',
    description:
      'Retrieve a paginated list of users. You can filter by activity status using the "activity" query parameter.',
  })
  @ApiResponse({
    status: 200,
    description: 'Request successful',
    example: {
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: [
        {
          id: 'bssbsjkbkjjsddnfd',
          firstName: 'demo',
          lastName: 'company',
          email: 'demo@yopmail.com',
          password:
            '$2b$08$Ld.1QypJ9Q9KnMqQGjnoxuPFsyJgJ3dY3znwwSz2MMZaRGPK0G26O',
          phone: '4578925602',
          role: 'company',
          status: 'active',
          lastLogin: null,
          ipAddress: null,
          isEmailVerified: true,
          profilePicture: null,
          loginStatus: null,
          createdAt: '2026-07-06T12:03:07.331Z',
          otp: null,
          otpExpiry: null,
          updatedAt: '2026-07-06T12:03:07.331Z',
          deletedAt: null,
          employment: null,
          details: {
            id: '417f0581-b0c9-4388-8ca5-98e7a8539d5e',
            dob: '2026-06-28',
            address: 'sddsdsdsd',
            companyUanNumber: 'example',
          },
        },
      ],
      meta: {
        total: 1,
        currentPage: 1,
        nextPage: null,
        lastPage: 1,
        limit: 10,
      },
      path: '/api/user/all?page=1&limit=10',
      method: 'GET',
      timestamp: '2026-07-12T05:32:56.371Z',
    },
  })
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
  @ApiQuery({
    name: 'permanentDelete',
    required: false,
    description:
      'Set to true for permanent deletion, otherwise the user will be soft deleted.',
  })
  @HttpCode(204)
  @Version('2')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  delete(
    @Param('userId') userId: string,
    @Query('permanentDelete') isPermanentdelete: string,
  ) {
    return this.usersService.delete(userId, isPermanentdelete);
  }

  @Post('add')
  @Version('2')
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(UserRole.ADMIN)
  addUser(@Body() body: AddUserFromAdmin) {
    return this.usersService.addUser(body);
  }
}
