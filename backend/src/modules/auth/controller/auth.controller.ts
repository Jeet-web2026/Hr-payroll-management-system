import { Controller, HttpCode, HttpException, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('signin')
  @HttpCode(200)
  signin() {
    return true;
  }
}
