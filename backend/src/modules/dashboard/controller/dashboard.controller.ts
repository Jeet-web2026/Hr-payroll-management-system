import { Controller, Get, Req, UseGuards, Version } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import * as express from 'express';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('dashboard')
@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@ApiCookieAuth('refresh-token')
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
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get dashboard statistics',
    description:
      'Retrieves the latest dashboard statistics, including employee counts, department summaries, leave requests, payroll insights, recruitment metrics, and other key performance indicators. A valid JWT access token and the appropriate permissions are required to access this information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Request successful',
    example: {
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: {
        totalEmployees: 0,
        newJoinees: 0,
        activeEmployees: 0,
        joiningRate: 0,
        employeeGrowthRate: 0,
        newJoineesRate: 0,
        newJoiningRate: 0,
      },
      meta: null,
      path: '/api/dashboard',
      method: 'GET',
      timestamp: '2026-07-12T10:33:56.816Z',
    },
  })
  getDashboardData(@Req() req: express.Request) {
    return this.dashboardService.getDashboardData(req.user);
  }

  @Version('2')
  @Get('stat-charts')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get dashboard statistics of charts',
    description:
      'Retrieves the latest dashboard statistics, including employee counts, department summaries, leave requests, payroll insights, recruitment metrics, and other key performance indicators. A valid JWT access token and the appropriate permissions are required to access this information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Request successful',
    example: {
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: {
        '0': {
          date: '2026-07-05',
          active: 1,
          newlyJoined: 1,
        },
        '1': {
          date: '2026-07-11',
          active: 1,
          newlyJoined: 1,
        },
        '2': {
          date: '2026-08-01',
          active: 1,
          newlyJoined: 1,
        },
      },
      meta: null,
      path: '/api/v2/dashboard/stat-charts',
      method: 'GET',
      timestamp: '2026-08-02T07:04:21.039Z',
    },
  })
  getStatChart(@Req() req: express.Request) {
    return this.dashboardService.getStatChart(req.user);
  }
}
