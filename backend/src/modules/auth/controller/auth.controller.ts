import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignInDto } from '../../../comon/dto/auth/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  signin(@Body() signinDto: SignInDto): Promise<any> {
    return this.authService.signIn(signinDto);
  }
}
