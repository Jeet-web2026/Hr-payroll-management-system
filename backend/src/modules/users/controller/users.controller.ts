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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('user')
@ApiTags('User Management')
@ApiBearerAuth()
@ApiCookieAuth('refreshToken')
@ApiHeader({
  name: 'Cookie',
  description: 'HTTP-only cookie containing the refresh token.',
  required: true,
  example: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
})
@ApiUnauthorizedResponse({
  description: 'Login expired or invalidated. Please log in again.',
  example: {
    success: false,
    statusCode: 401,
    errors: 'Internal Server Error',
    message: 'Unauthorized',
    path: '{api path}',
    method: 'GET',
    timestamp: '2026-07-12T08:09:46.061Z',
  },
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get authenticated user information',
    description:
      'Retrieves the profile information of the currently authenticated user. A valid JWT access token must be provided in the Authorization header. Returns the user details associated with the authenticated session.',
  })
  @ApiResponse({
    description: 'Request successful',
    example: {
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: {
        id: 'dfgdjgdfjdfjkf',
        firstName: 'TeamHub',
        lastName: 'Admin',
        email: 'example@teamhub.com',
        role: 'admin',
        status: 'active',
        loginStatus: 'online',
        isEmailVerified: true,
        lastLogin: '2026-07-12T08:13:50.184Z',
        phone: null,
        profilePicture: null,
        employment: null,
        details: null,
        usersPermissionManagement: {
          manageUser: true,
          notifications: true,
          holidayManagement: false,
          employeeManagement: false,
          attendanceManagement: false,
          payrollManagement: false,
          leaveManagement: false,
          recruitmentManagement: false,
          dashboard: {
            totalEmployeeCount: true,
            newJoineesCount: true,
            activeEmployeeCount: true,
            joiningRateCount: true,
            totalGrowth: {
              type: 'company_basis',
            },
          },
        },
      },
      meta: null,
      path: '/api/user/me',
      method: 'GET',
      timestamp: '2026-07-12T08:14:08.113Z',
    },
  })
  getProfile(@GetUser() user: JwtUser): UserResponseDto {
    const userData = this.usersService.findById(user.id);
    return plainToInstance(UserResponseDto, userData, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/permissions')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get all available permissions',
    description:
      'Returns all available system permissions that can be assigned to users or roles. The response includes the unique identifier and permission value for each permission. A valid JWT access token is required to access this endpoint.',
  })
  @ApiResponse({
    description: 'Request successful',
    example: {
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: {
        '0': {
          id: '29107837-cf7d-4eb3-bb19-3f7a19ff5d62',
          permissionvalue: 'user-management',
        },
        '1': {
          id: '22ef56b5-8b34-4ee3-86cc-74dbab0c0209',
          permissionvalue: 'leave-management',
        },
        '2': {
          id: '91ac16f4-2891-4514-babb-7696a3fbb3e6',
          permissionvalue: 'employee-management',
        },
        '3': {
          id: '8d827489-3041-4d59-b8d0-cbaef9ed7ce3',
          permissionvalue: 'payroll-management',
        },
        '4': {
          id: 'b42e569a-b4f1-4ba3-bfac-6349f810662a',
          permissionvalue: 'recruit-management',
        },
      },
      meta: null,
      path: '/api/user/permissions',
      method: 'GET',
      timestamp: '2026-07-12T08:18:37.612Z',
    },
  })
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
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User id for fetch the user details.',
    example: 'sdfbsdjfnsdfnsddsds',
  })
  @ApiResponse({
    status: 200,
    description: 'Request successful',
    example: {
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: {
        id: 'kjiujkhuinnk',
        firstName: 'changed',
        lastName: 'User',
        email: 'demo@yopmail.com',
        role: 'employee',
        status: 'active',
        loginStatus: 'online',
        isEmailVerified: true,
        lastLogin: '2026-06-21T11:33:17.003Z',
        phone: null,
        profilePicture: null,
        employment: null,
        details: null,
        usersPermissionManagement: {
          notifications: true,
          leaveManagement: true,
          attendanceManagement: true,
        },
      },
      meta: null,
      path: '/api/user/kjhhjkj',
      method: 'GET',
      timestamp: '2026-07-12T08:31:35.822Z',
    },
  })
  @ApiOperation({
    summary: 'Retrive user info.',
    description: 'Retrieve info of users.',
  })
  view(@Param('userId') userId: string): UserResponseDto {
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
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User id for update the user details.',
    example: 'sdfbsdjfnsdfnsddsds',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    example: {
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: {
        id: 'dsjdfdfjdsjsdnsds',
        firstName: 'changed2',
        lastName: 'User',
        email: 'demo@yopmail.com',
        role: 'employee',
        status: 'active',
        loginStatus: 'online',
        isEmailVerified: true,
        lastLogin: '2026-06-21T11:33:17.003Z',
        phone: null,
        profilePicture: null,
        employment: null,
        details: null,
      },
      meta: null,
      path: '/api/user/update/dsjdfdfjdsjsdnsds',
      method: 'PUT',
      timestamp: '2026-07-12T08:42:07.830Z',
    },
  })
  @ApiOperation({
    summary: 'Update user information',
    description:
      'Updates the details of an existing user. Only the fields provided in the request body will be updated. This endpoint requires a valid JWT access token and appropriate permissions to modify user information.',
  })
  @ApiBody({
    description: 'Update user information',
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          example: 'John',
          description: 'First name of the user',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
          description: 'Last name of the user',
        },
        email: {
          type: 'string',
          format: 'email',
          example: 'john@example.com',
          description: 'Email address',
        },
        contactNumber: {
          type: 'string',
          example: '+919876543210',
          description: 'Contact number',
        },
      },
    },
  })
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
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User id for update the user details.',
    example: 'sdfbsdjfnsdfnsddsds',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    example: {
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: {
        id: 'dsjdfdfjdsjsdnsds',
        firstName: 'changed2',
        lastName: 'User',
        email: 'demo@yopmail.com',
        role: 'employee',
        status: 'active',
        loginStatus: 'online',
        isEmailVerified: true,
        lastLogin: '2026-06-21T11:33:17.003Z',
        phone: null,
        profilePicture: null,
        employment: null,
        details: null,
      },
      meta: null,
      path: '/api/user/update/dsjdfdfjdsjsdnsds',
      method: 'PUT',
      timestamp: '2026-07-12T08:42:07.830Z',
    },
  })
  @ApiOperation({
    summary: 'Update user information',
    description:
      'Updates the details of an existing user. Only the fields provided in the request body will be updated. This endpoint requires a valid JWT access token and appropriate permissions to modify user information.',
  })
  @ApiBody({
    description: 'Update user information',
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          example: 'John',
          description: 'First name of the user',
        },
      },
    },
  })
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
