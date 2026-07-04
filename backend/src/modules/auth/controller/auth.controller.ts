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
  async signin(
    @Body() signinDto: SignInDto,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<UserResponseDto> {
    const userData = await this.authService.signIn(signinDto);

    res.cookie('refreshToken', userData.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return userData;
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
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return data;
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshToken(
    @Req() req: express.Request,
  ): Promise<{ accessToken: string }> {
    const token = req.cookies['refreshToken'];

    if (!token) {
      throw new UnauthorizedException('Login expired. Please login again.');
    }

    return await this.authService.refreshToken(token);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(
    @Req() req: GoogleRequest,
    @Res() res: express.Response,
  ) {
    const user = req.user as any;
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      '0.0.0.0';
    const data = await this.authService.socialLogin(user, ip);
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      `${process.env.APP_URL}/auth/success?accessToken=${data.accessToken}`,
    );
  }

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  linkedInLogin() {}

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinRedirect(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const user = req.user as any;
    const profile = {
      ...user.profile,
      firstName: user.profile.given_name,
      lastName: user.profile.family_name,
    };
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      '0.0.0.0';
    const data = await this.authService.socialLogin(profile, ip);
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      `${process.env.APP_URL}/auth/success?accessToken=${data.accessToken}`,
    );
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookRedirect(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const user = req.user as any;
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      '0.0.0.0';
    const data = await this.authService.socialLogin(user, ip);
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      `${process.env.APP_URL}/auth/success?accessToken=${data.accessToken}`,
    );
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async logout(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const user = req.user as any;
    await this.authService.logout(
      user.id,
      req.headers.authorization?.split(' ')[1] || '',
    );

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return { message: 'Logged out successfully' };
  }
}
