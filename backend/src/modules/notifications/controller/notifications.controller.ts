import { Controller, Get, Req, UseGuards, Version } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as express from 'express';
import { NotificationsService } from '../services/notifications.service';

@Controller('notifications')
@ApiTags('Notification Management')
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Version('2')
  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get all notifications by current user role',
    description:
      'Retrieves the list of notifications relevant to the currently authenticated user, filtered by their role. A valid JWT access token must be provided in the Authorization header.',
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
  getAllNotifications(@Req() req: express.Request) {
    return this.notificationService.getAllNotifications(req.user);
  }
}
