import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignInDto } from '../../../comon/dto/auth/signIn.dto';
import { User } from '../../users/model/user.entity';
import { UserDataDto } from '../../../comon/dto/auth/userData.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  signin(@Body() signinDto: SignInDto): Promise<User> {
    return this.authService.signIn(signinDto);
  }

  @Post('signup')
  @HttpCode(201)
  signup(@Body() userData: UserDataDto): Promise<User> {
    return this.authService.signUp(userData);
  }
}
