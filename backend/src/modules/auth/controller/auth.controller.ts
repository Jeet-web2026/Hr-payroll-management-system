import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignInDto } from '../../../comon/dto/auth/signIn.dto';
import { User } from '../../users/model/user.entity';
import { UserDataDto } from '../../../comon/dto/auth/userData.dto';
import { UserResponseDto } from '../../../comon/dto/auth/userResponse.dto';
import { EmailVerificationDto } from '../../../comon/dto/auth/emailVerification.dto';
import * as express from 'express';
import { AuthGuard } from '@nestjs/passport';
import type { GoogleRequest } from '../../../comon/requests/googleRequest';

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
  signup(
    @Body() userData: UserDataDto,
    @Req() req: express.Request,
  ): Promise<UserResponseDto> {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      '0.0.0.0';
    return this.authService.signUp(userData, ip);
  }

  @Post('email-verification')
  @HttpCode(200)
  async emailVerification(
    @Body() emailData: EmailVerificationDto,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<UserResponseDto> {
    const data = await this.authService.emailVerification(emailData);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    delete data.refreshToken;
    return data;
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshToken(
    @Req() req: express.Request,
  ): Promise<{ accessToken: string }> {
    const token = req.cookies['refreshToken'];

    if (!token) {
      throw new UnauthorizedException('Refresh token not found.');
    }

    return this.authService.refreshToken(token);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleRedirect(@Req() req: GoogleRequest, @Res() res: express.Response) {
    const user = req.user as any;
    return this.authService.socialLogin(user);
  }
}
