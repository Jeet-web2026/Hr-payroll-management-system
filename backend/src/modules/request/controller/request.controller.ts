import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as express from 'express';
import { RequestService } from '../service/request.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('requests')
@ApiTags('Leave Requests')
export class RequestController {
  constructor(private readonly reqService: RequestService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  allRequests(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return this.reqService.allRequests(req);
  }
}
