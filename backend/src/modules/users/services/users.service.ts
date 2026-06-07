import {
  BadGatewayException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LoginStatus, User, UserRole, UserStatus } from '../models/user.entity';
import { UserDataDto } from '../../../comon/dto/auth/userData.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { SocialAuthDto } from '../../../comon/dto/auth/socialAuth.dto';
import { PaginatedResponse } from '../../../comon/interfaces/paginatedDataresponse.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id },
        relations: {
          employment: true,
        },
        withDeleted: true,
      });

      return user;
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
          loginStatus: LoginStatus.ONLINE,
        });

        return await this.userRepository.save(user);
      }

      if (user) {
        await this.userRepository.update(user.id, {
          lastLogin: new Date(),
          ipAddress,
          loginStatus: LoginStatus.ONLINE,
        });
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

  async statictics(id: string): Promise<{
    totalEmployees: number;
    newJoinees: number;
    activeEmployees: number;
    joiningRate: number;
    employeeGrowthRate: number;
    newJoineesRate: number;
    newJoiningRate: number;
  }> {
    const user = await this.findById(id);

    const totalEmployees =
      user.role === UserRole.HR
        ? await this.userRepository.count({
            where: { role: UserRole.EMPLOYEE },
          })
        : 0;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const daysPassed = Math.ceil(
      (now.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24),
    );

    const expectedJoinees = (daysPassed / 2) * 5;
    const newJoinees =
      user.role === UserRole.HR
        ? await this.userRepository.count({
            where: {
              role: UserRole.EMPLOYEE,
              status: UserStatus.ACTIVE,
              createdAt: Between(startOfMonth, endOfMonth),
            },
          })
        : 0;
    const activeEmployees =
      user.role === UserRole.HR
        ? await this.userRepository.count({
            where: { role: UserRole.EMPLOYEE, status: UserStatus.ACTIVE },
          })
        : 0;

    const joiningRate =
      user.role === UserRole.HR
        ? totalEmployees > 0
          ? Math.round((newJoinees / totalEmployees) * 100)
          : 0
        : 0;

    const totalEmployeesCurrent = await this.userRepository.count({
      where: {
        role: UserRole.EMPLOYEE,
        status: UserStatus.ACTIVE,
      },
    });

    const totalEmployeesPrevious = await this.userRepository.count({
      where: {
        role: UserRole.EMPLOYEE,
        status: UserStatus.ACTIVE,
        createdAt: LessThan(startOfMonth),
      },
    });

    const employeeGrowthRate =
      user.role === UserRole.HR && totalEmployeesPrevious > 0
        ? ((totalEmployeesCurrent - totalEmployeesPrevious) /
            totalEmployeesPrevious) *
          100
        : 0;

    const prevMonthJoinees = await this.userRepository.count({
      where: {
        role: UserRole.EMPLOYEE,
        status: UserStatus.ACTIVE,
        createdAt: Between(previousMonthStart, previousMonthEnd),
      },
    });

    const newJoineesRate =
      user.role === UserRole.HR && prevMonthJoinees > 0
        ? ((newJoinees - prevMonthJoinees) / prevMonthJoinees) * 100
        : 0;

    const newJoiningRate =
      user.role === UserRole.HR && expectedJoinees > 0
        ? Math.round(((newJoinees - expectedJoinees) / expectedJoinees) * 100)
        : 0;

    return {
      totalEmployees,
      newJoinees,
      activeEmployees,
      joiningRate,
      employeeGrowthRate,
      newJoineesRate,
      newJoiningRate,
    };
  }

  async allUsers(
    page: number,
    limit: number,
    userId: string,
    activity: string,
  ): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * limit;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentUserRole = user?.role;
    const roleMap: Record<UserRole, UserRole> = {
      [UserRole.ADMIN]: UserRole.COMPANY,
      [UserRole.COMPANY]: UserRole.HR,
      [UserRole.HR]: UserRole.EMPLOYEE,
      [UserRole.EMPLOYEE]: UserRole.EMPLOYEE,
    };

    const setRole = roleMap[currentUserRole];
    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', {
        role: setRole,
      });

    if (activity !== 'permission-management') {
      query.andWhere('user.status = :status', {
        status: UserStatus.ACTIVE,
      });
    } else {
      query.withDeleted();
    }

    console.log(skip, limit);

    const [data, total] = await query
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        currentPage: page,
        nextPage: skip + limit < total ? page + 1 : null,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async delete(userId: string, isPermanentDelete: string) {
    if (isPermanentDelete === 'true') {
      await this.userRepository.delete(userId);

      return {
        message: 'User permanently deleted successfully',
      };
    }

    const result = await this.userRepository.update(userId, {
      status: UserStatus.SUSPENDED,
      deletedAt: new Date(),
    });

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User deleted successfully',
    };
  }
}
