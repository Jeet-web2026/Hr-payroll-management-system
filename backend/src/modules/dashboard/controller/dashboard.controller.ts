import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import * as express from 'express';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getDashboardData(@Req() req: express.Request) {
    return this.dashboardService.getDashboardData(req.user);
  }
}
