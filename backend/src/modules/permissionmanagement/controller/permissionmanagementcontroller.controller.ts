import { Body, Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionmanagementService } from '../service/permissionmanagement.service';
import * as express from 'express';
import { UserRole } from '../../users/model/user.entity';

@Controller('permissionmanagement')
@UseGuards(AuthGuard('jwt'))
export class PermissionmanagementcontrollerController {
  constructor(private readonly pmservice: PermissionmanagementService) {}

  @Get('all-users')
  getallUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: express.Request,
    @Body('role') role: UserRole,
  ) {
    return this.pmservice.getallUsers(page, limit, req, role);
  }
}
