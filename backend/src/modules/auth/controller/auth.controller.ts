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
  ApiBearerAuth,
  ApiCookieAuth,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
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
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Generates a new access token using a valid refresh token. The refresh token must be provided in the request cookie or authorization header. If the refresh token is valid and has not expired or been revoked, a new access token is issued.',
  })
  @ApiHeader({
    name: 'Cookie',
    description: 'Authentication cookie',
    required: true,
    example: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
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
  @ApiOperation({
    summary: 'Authenticate with Google',
    description:
      'Initiates the Google OAuth 2.0 authentication flow. The user is redirected to the Google sign-in page to grant access. No request body or authentication token is required.',
  })
  @ApiResponse({
    status: 302,
    description:
      'Redirects the user to the Google authentication and consent screen.',
  })
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth callback',
    description:
      'Handles the callback from Google after successful authentication. The user Google profile is validated, the application authenticates or registers the user, generates JWT tokens, stores the refresh token in an HTTP-only cookie, and redirects the user to the frontend with the access token.',
  })
  @ApiResponse({
    status: 302,
    description:
      'Redirects the authenticated user to the frontend application with the access token and sets the refresh token as a secure HTTP-only cookie.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Authentication failed because the Google account could not be verified or access was denied.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'An unexpected error occurred while processing the LinkedIn authentication request.',
  })
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
  @ApiOperation({
    summary: 'Authenticate with LinkedIn',
    description:
      'Initiates the LinkedIn OAuth 2.0 authentication flow by redirecting the user to the LinkedIn sign-in and authorization page. After successful authentication, LinkedIn redirects the user to the configured callback endpoint.',
  })
  @ApiResponse({
    status: 302,
    description:
      'Redirects the user to the LinkedIn authentication and authorization page.',
  })
  linkedInLogin() {}

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  @ApiOperation({
    summary: 'LinkedIn OAuth callback',
    description:
      'Handles the callback from LinkedIn after successful authentication. The application retrieves the user profile, authenticates or registers the user, generates JWT access and refresh tokens, stores the refresh token in a secure HTTP-only cookie, and redirects the user to the frontend application with the access token.',
  })
  @ApiResponse({
    status: 302,
    description:
      'Successfully authenticates the user, sets the refresh token as a secure HTTP-only cookie, and redirects the user to the frontend application with the access token.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Authentication failed because the LinkedIn account could not be verified or the user denied access.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'An unexpected error occurred while processing the LinkedIn authentication request.',
  })
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
  @ApiOperation({
    summary: 'Authenticate with Facebook',
    description:
      'Initiates the Facebook OAuth 2.0 authentication flow by redirecting the user to the Facebook login and authorization page. After successful authentication, Facebook redirects the user to the configured callback endpoint.',
  })
  @ApiResponse({
    status: 302,
    description:
      'Redirects the user to the Facebook authentication and authorization page.',
  })
  async facebookLogin() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({
    summary: 'Facebook OAuth callback',
    description:
      'Handles the callback from Facebook after successful authentication. The application retrieves the authenticated user profile, authenticates or registers the user, generates JWT access and refresh tokens, stores the refresh token in a secure HTTP-only cookie, and redirects the user to the frontend application with the access token.',
  })
  @ApiResponse({
    status: 302,
    description:
      'Successfully authenticates the user, sets the refresh token as a secure HTTP-only cookie, and redirects the user to the frontend application with the access token.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Authentication failed because the Facebook account could not be verified or the user denied access.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'An unexpected error occurred while processing the Facebook authentication request.',
  })
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
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Logs out the authenticated user by invalidating the access token, clearing the refresh token cookie, and terminating the current session. A valid JWT access token in the Authorization header and a valid refresh token in the Cookie header are required.',
  })
  @ApiBearerAuth()
  @ApiCookieAuth('refreshToken')
  @ApiHeader({
    name: 'Cookie',
    description: 'HTTP-only cookie containing the refresh token.',
    required: true,
    example: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiOkResponse({
    description: 'Logged out successfully',
    example: {
      success: true,
      statusCode: 200,
      message: 'Logged out successfully',
      data: {},
      meta: null,
      path: '/api/auth/logout',
      method: 'POST',
      timestamp: '2026-07-12T07:58:25.498Z',
    },
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized. The access token or refresh token is missing, invalid, expired, or revoked.',
    example: {
      success: false,
      statusCode: 401,
      errors: 'Internal Server Error',
      message: 'Login expired or invalidated. Please log in again.',
      path: '/api/auth/logout',
      method: 'POST',
      timestamp: '2026-07-12T08:00:46.265Z',
    },
  })
  @ApiBadRequestResponse({
    description:
      'The logout request is invalid or the required authentication headers are missing.',
    example: {
      success: false,
      statusCode: 401,
      errors: 'Internal Server Error',
      message: 'Unauthorized',
      path: '/api/auth/logout',
      method: 'POST',
      timestamp: '2026-07-12T08:01:23.361Z',
    },
  })
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
