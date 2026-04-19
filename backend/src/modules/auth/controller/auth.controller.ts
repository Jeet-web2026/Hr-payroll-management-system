import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignInDto } from '../../../comon/dto/auth/signIn.dto';
import { User } from '../../users/model/user.entity';
import { UserDataDto } from '../../../comon/dto/auth/userData.dto';
import { UserResponseDto } from '../../../comon/dto/auth/userResponse.dto';
import { EmailVerificationDto } from '../../../comon/dto/auth/emailVerification.dto';

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
  @UseInterceptors(ClassSerializerInterceptor)
  signup(@Body() userData: UserDataDto): Promise<UserResponseDto> {
    return this.authService.signUp(userData);
  }

  @Post('email-verification')
  @HttpCode(200)
  emailVerification(
    @Body() emailData: EmailVerificationDto,
  ): Promise<UserResponseDto> {
    return this.authService.emailVerification(emailData);
  }
}
