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
import { UserStatus } from '../../users/model/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly eventEmitter: EventEmitter2,
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
      };
    }

    if (user.otp !== emailData.emailCode) {
      throw new BadRequestException('Invalid or expired OTP.');
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired OTP.');
    }

    const verifiedUser = await this.userService.updateUser(user.id, {
      isEmailVerified: true,
      otp: null,
      otpExpiry: null,
      status: UserStatus.ACTIVE,
    });

    return {
      ...plainToInstance(UserResponseDto, verifiedUser),
      message: 'Email verified successfully.',
    };
  }
}
