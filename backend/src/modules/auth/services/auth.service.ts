import {
  BadRequestException,
  Injectable,
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
import { User, UserStatus } from '../../users/model/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signinDto: SignInDto): Promise<any> {
    try {
      return await this.userService.findByEmail(signinDto.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async signUp(userData: UserDataDto): Promise<UserResponseDto> {
    const savedUser = await this.userService.createUser(userData);
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
      };
    }

    if (Number(user.otp) !== Number(emailData.emailCode)) {
      throw new BadRequestException('Invalid OTP.');
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      throw new BadRequestException('OTP expired.');
    }

    const [verifiedUser, refreshToken] = await Promise.all([
      this.userService.updateUser(user.id, {
        isEmailVerified: true,
        otp: null,
        otpExpiry: null,
        status: UserStatus.ACTIVE,
      }),
      this.getRefreshToken(user),
    ]);

    return {
      ...plainToInstance(UserResponseDto, verifiedUser),
      message: 'Email verified successfully.',
      refreshToken,
    };
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
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1d',
    });
  }
}
