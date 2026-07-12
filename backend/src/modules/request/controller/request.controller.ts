import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as express from 'express';
import { RequestService } from '../service/request.service';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('requests')
@ApiTags('Leave Requests')
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
export class RequestController {
  constructor(private readonly reqService: RequestService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get all leave requests',
    description:
      'Retrieves a list of all leave requests submitted by employees. The response may include details such as the employee, leave type, duration, status, and submission date. A valid JWT access token and the appropriate permissions are required to access this information.',
  })
  allRequests(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return this.reqService.allRequests(req);
  }
}
