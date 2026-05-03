import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../../../comon/dto/auth/signIn.dto';
import { UsersService } from '../../users/services/users.service';
import { UserDataDto } from '../../../comon/dto/auth/userData.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserResponseDto } from '../../../comon/dto/auth/userResponse.dto';
import { plainToInstance } from 'class-transformer';
import { WelcomeMailEvent } from '../../mail/events/mail.event';
import { EmailVerificationDto } from '../../../comon/dto/auth/emailVerification.dto';
import { LoginStatus, User, UserStatus } from '../../users/model/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SocialAuthDto } from '../../../comon/dto/auth/socialAuth.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signinDto: SignInDto): Promise<UserResponseDto> {
    try {
      const user = await this.userService.findByEmail(signinDto.email);

      if (!user) {
        throw new NotFoundException('Wrong credentials.');
      }

      if (!user.isEmailVerified) {
        throw new UnauthorizedException(
          'Please verify your email address to login.',
        );
      }

      const isPasswordValid = await bcrypt.compare(
        signinDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      await this.userService.updateUser(user.id, {
        lastLogin: new Date(),
        loginStatus: LoginStatus.ONLINE,
      });

      const [accessToken, refreshToken] = await Promise.all([
        this.getAccessToken(user),
        this.getRefreshToken(user),
      ]);
      return {
        ...plainToInstance(UserResponseDto, user),
        message: 'Login successfull',
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Something went wrong!');
    }
  }

  async socialLogin(
    socialAuthDto: SocialAuthDto,
    ip: string,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.userService.socialLogin(socialAuthDto, ip);

      const [accessToken, refreshToken] = await Promise.all([
        this.getAccessToken(user),
        this.getRefreshToken(user),
      ]);
      return {
        ...plainToInstance(UserResponseDto, user),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException('Something went wrong.');
    }
  }

  async signUp(userData: UserDataDto, ip: string): Promise<UserResponseDto> {
    const savedUser = await this.userService.createUser(userData, ip);
    this.eventEmitter.emit(
      'mail.welcome',
      new WelcomeMailEvent(
        savedUser.email,
        savedUser.firstName,
        savedUser.otp,
        savedUser.otpExpiry,
      ),
    );
    return {
      ...plainToInstance(UserResponseDto, savedUser),
      message: 'Registration successful, please verify your email address.',
    };
  }

  async emailVerification(
    emailData: EmailVerificationDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findByEmail(emailData.email);

    if (user.isEmailVerified) {
      return {
        ...plainToInstance(UserResponseDto, user),
        message: 'Email already verified login to continue.',
        refreshToken: await this.getRefreshToken(user),
        accessToken: await this.getAccessToken(user),
      };
    }

    if (Number(user.otp) !== Number(emailData.emailCode)) {
      throw new BadRequestException('Invalid OTP.');
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      throw new BadRequestException('OTP expired.');
    }

    const verifiedUser = this.userService.updateUser(user.id, {
      isEmailVerified: true,
      otp: null,
      otpExpiry: null,
      status: UserStatus.ACTIVE,
      loginStatus: LoginStatus.ONLINE,
    });

    const [refreshToken, accessToken] = await Promise.all([
      this.getRefreshToken(user),
      this.getAccessToken(user),
    ]);

    return {
      ...plainToInstance(UserResponseDto, verifiedUser),
      message: 'Email verified successfully.',
      refreshToken,
      accessToken,
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      const accessToken = await this.getAccessToken(user);
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  async getAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      role: user.role,
      status: user.status,
    };
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
  }

  async getRefreshToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      role: user.role,
      status: user.status,
    };
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '1d',
    });
  }
}
