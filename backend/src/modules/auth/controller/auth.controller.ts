import { Controller, HttpCode, Post } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('signin')
  @HttpCode(200)
  signin() {
    return true;
  }
}
