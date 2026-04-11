import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('signin')
  signin() {
    return 'signin';
  }
}
