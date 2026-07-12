import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Check API health status',
    description:
      'Verifies the health and availability of the application by returning its current operational status. This endpoint can be used by monitoring systems, load balancers, and administrators to ensure the API is running and responsive.',
  })
  @ApiResponse({
    status: 200,
    description: 'Request successful',
    example: {
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: {
        status: 'ok',
        info: {
          'nestjs-docs': {
            status: 'up',
          },
          db: {
            status: 'up',
          },
        },
        error: {},
        details: {
          'nestjs-docs': {
            status: 'up',
          },
          db: {
            status: 'up',
          },
        },
      },
      meta: null,
      path: '/api/health',
      method: 'GET',
      timestamp: '2026-07-12T10:36:51.120Z',
    },
  })
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('db'),
    ]);
  }
}
