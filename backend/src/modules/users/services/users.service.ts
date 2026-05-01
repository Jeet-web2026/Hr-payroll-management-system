import {
  BadGatewayException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole, UserStatus } from '../model/user.entity';
import { UserDataDto } from '../../../comon/dto/auth/userData.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { SocialAuthDto } from '../../../comon/dto/auth/socialAuth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { id: String(id) },
      });
    } catch (error) {
      throw new NotFoundException(`User not exsists`);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      throw new NotFoundException(`User not exsists`);
    }
  }

  async createUser(userData: UserDataDto, ip: string): Promise<User> {
    try {
      const userExists = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (userExists) {
        throw new ConflictException('Credentials already exsist!');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = this.userRepository.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        role: UserRole.EMPLOYEE,
        status: UserStatus.INACTIVE,
        otp: Math.floor(100000 + Math.random() * 900000),
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
        ipAddress: ip,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadGatewayException('Failed to create user');
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      await this.userRepository.update(userId, userData);

      return this.userRepository.findOneOrFail({
        where: { id: userId },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user.');
    }
  }

  async socialLogin(userData: SocialAuthDto, ipAddress: string): Promise<User> {
    try {
      let user = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (!user) {
        const generatedPassword = this.getFormattedTimestamp();

        const hashedPassword = await bcrypt.hash(
          userData.email + generatedPassword,
          10,
        );

        user = this.userRepository.create({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: hashedPassword,
          role: UserRole.EMPLOYEE,
          status: UserStatus.ACTIVE,
          otp: null,
          otpExpiry: null,
          profilePicture: userData.picture,
          ipAddress: ipAddress,
          lastLogin: new Date(),
          isEmailVerified: true,
        });

        return await this.userRepository.save(user);
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to login user.');
    }
  }

  getFormattedTimestamp() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${day}${month}${year}${hours}${minutes}`;
  }
}
