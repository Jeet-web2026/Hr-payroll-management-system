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
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({
    summary: 'Sign in a user with email and password.',
    description:
      'Authenticate a user using their email and password. Returns user details and tokens upon successful authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    example: {
      success: true,
      statusCode: 200,
      message: 'Login successfull',
      data: {
        id: 'dkfjhdsoldfkdlkfdf',
        firstName: 'TeamHub',
        lastName: 'Admin',
        email: 'example@teamhub.com',
        role: 'admin',
        status: 'active',
        loginStatus: 'online',
        isEmailVerified: true,
        lastLogin: '2026-07-12T03:25:46.488Z',
        phone: null,
        profilePicture: null,
        employment: null,
        details: null,
        accessToken: 'dfgjkhdjdfjdfndfndfkdfndf,mndfdfnfdndf',
        usersPermissionManagement: {
          manageUser: true,
          notifications: true,
          holidayManagement: false,
          employeeManagement: false,
          attendanceManagement: false,
          payrollManagement: false,
          leaveManagement: false,
          recruitmentManagement: false,
          dashboard: {
            totalEmployeeCount: true,
            newJoineesCount: true,
            activeEmployeeCount: true,
            joiningRateCount: true,
            totalGrowth: {
              type: 'company_basis',
            },
          },
        },
      },
      meta: null,
      path: '/api/auth/signin',
      method: 'POST',
      timestamp: '2026-07-12T05:32:32.434Z',
    },
  })
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
  @ApiOperation({
    summary:
      'Sign up a new user with provided details. It contains IP adress also.',
    description:
      'Create a new user account with the provided details. Returns user details and tokens upon successful registration.',
  })
  @ApiResponse({
    status: 201,
    description: 'Registration successful, please verify your email address.',
    example: {
      success: true,
      statusCode: 201,
      message: 'Registration successful, please verify your email address.',
      data: {
        id: 'dskfjhdfdfkdfndssdds',
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@yopmail.com',
        role: 'employee',
        status: 'inactive',
        loginStatus: null,
        isEmailVerified: false,
        lastLogin: null,
        phone: null,
        profilePicture: null,
      },
      meta: null,
      path: '/api/auth/signup',
      method: 'POST',
      timestamp: '2026-07-12T07:23:03.243Z',
    },
  })
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
  @ApiOperation({
    summary: 'Verify user email address',
    description:
      'Verifies the email address of a newly registered user by validating the provided email address. If the email is valid and registered, a verification email or verification process will be initiated.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    example: {
      success: true,
      statusCode: 200,
      message: 'Email verified successfully.',
      data: {
        accessToken: 'fgjbhfgfglkffdlfd,fdf;ddf;',
      },
      meta: null,
      path: '/api/auth/email-verification',
      method: 'POST',
      timestamp: '2026-07-12T07:28:24.287Z',
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation for email verification',
    example: {
      success: false,
      statusCode: 400,
      errors: {
        emailCode: ['emailCode must not be less than 100000'],
      },
      message: 'Validation failed',
      path: '/api/auth/email-verification',
      method: 'POST',
      timestamp: '2026-07-12T07:41:59.070Z',
    },
  })
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
