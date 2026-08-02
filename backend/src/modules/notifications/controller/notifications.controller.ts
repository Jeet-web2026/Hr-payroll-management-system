import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
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
        '0': {
          content: 'demo subject',
          status: 'new',
          receivedAt: '08/02/2026, 02:00 AM',
        },
      },
      meta: null,
      path: '/api/v2/notifications/all',
      method: 'GET',
      timestamp: '2026-08-02T14:27:31.161Z',
    },
  })
  getAllNotifications(@Req() req: express.Request) {
    return this.notificationService.getAllNotifications(req.user);
  }

  @Version('2')
  @Patch('read/:notificationId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Mark a notification as read',
    description:
      'Marks the notification with the given ID as read for the currently authenticated user. A valid JWT access token must be provided in the Authorization header. Returns the updated notification.',
  })
  @ApiResponse({
    description: 'Request successful',
    example: {
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: {},
      meta: null,
      path: '/api/v2/notifications/read/bbbd8342-58dd-495d-84cd-a947105b9ff3',
      method: 'PATCH',
      timestamp: '2026-08-02T16:00:37.850Z',
    },
  })
  readNotification(
    @Param('notificationId', ParseUUIDPipe) notificationId: string,
  ) {
    return this.notificationService.readNotification(notificationId);
  }

  @Version('2')
  @Delete('delete/:notificationId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Delete a notification',
    description:
      'Deletes the notification with the given ID. A valid JWT access token must be provided in the Authorization header. Only authorized users (e.g. admin) may delete notifications.',
  })
  @ApiResponse({
    description: 'Request successful',
    example: {
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: {
        '0': {
          content: 'demo subject',
          status: 'new',
          receivedAt: '08/02/2026, 02:00 AM',
        },
      },
      meta: null,
      path: '/api/v2/notifications/all',
      method: 'GET',
      timestamp: '2026-08-02T14:27:31.161Z',
    },
  })
  deleteNotification(
    @Param('notificationId', ParseUUIDPipe) notificationId: string,
  ) {
    return this.notificationService.deleteNotification(notificationId);
  }
}
