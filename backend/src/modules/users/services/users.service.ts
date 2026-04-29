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
      console.log(error);
      throw new BadGatewayException('Failed to create user');
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      await this.userRepository.update(userId, userData);
      return await this.findById(userId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user.');
    }
  }
}
