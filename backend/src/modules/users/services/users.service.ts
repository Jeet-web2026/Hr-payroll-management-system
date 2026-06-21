import {
  BadGatewayException,
  ConflictException,
  HttpException,
  Inject,
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
import { UserPermission } from '../../../comon/interfaces/userPermission.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UserPermissions } from '../models/userPermissions.entity';
import { AddUserFromAdmin } from '../../../comon/dto/admin/add-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsercreatedEvent } from '../../mail/events/mail.event';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserPermissions)
    private readonly userPermissionMangementrepository: Repository<UserPermissions>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly eventService: EventEmitter2,
  ) {}

  async findById(id: string): Promise<User> {
    try {
      const cacheKey = `user:${id}`;
      const cachedUser = await this.cacheManager.get<User>(cacheKey);

      if (cachedUser) {
        return cachedUser;
      }
      const user = await this.userRepository.findOneOrFail({
        where: { id },
        relations: ['employment', 'details'],
        withDeleted: true,
      });
      const userPermissions = await this.usersPermissionManagement(user);

      const response = {
        ...user,
        usersPermissionManagement: userPermissions,
      };

      await this.cacheManager.set(cacheKey, response);

      return response;
    } catch (error) {
      throw new NotFoundException(`User not exsists`);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { email },
        relations: ['employment', 'details'],
      });
      return user;
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

  async updateUser(
    userId: string,
    updateUserDto: Partial<User>,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: true,
      relations: ['employment', 'details'],
    });

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async socialLogin(userData: SocialAuthDto, ipAddress: string) {
    try {
      let user = await this.userRepository.findOne({
        where: { email: userData.email },
        relations: ['employment', 'details'],
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
          ipAddress,
          lastLogin: new Date(),
          isEmailVerified: true,
          loginStatus: LoginStatus.ONLINE,
        });

        user = await this.userRepository.save(user);
      } else {
        await this.userRepository.update(user.id, {
          lastLogin: new Date(),
          ipAddress,
          loginStatus: LoginStatus.ONLINE,
        });

        user.lastLogin = new Date();
        user.ipAddress = ipAddress;
        user.loginStatus = LoginStatus.ONLINE;
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
      })
      .leftJoinAndSelect('user.employment', 'employment')
      .leftJoinAndSelect('user.details', 'details');

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

  async usersPermissionManagement(user: User): Promise<UserPermission> {
    switch (user.role) {
      case UserRole.ADMIN:
        return this.adminUserPermissionManagement();

      case UserRole.HR:
        return this.hrPermissionManagement();

      case UserRole.COMPANY:
        return this.companyPermissionManagement();

      case UserRole.EMPLOYEE:
        return this.employeePermissionManagement();

      default:
        return {};
    }
  }

  async allPermissions() {
    return this.userPermissionMangementrepository.find();
  }

  async addUser(body: AddUserFromAdmin) {
    const isUserExsist = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (isUserExsist) {
      return new ConflictException('User already exsist!');
    }

    const [firstName, lastName] = body.name.trim().split(' ');
    const hashedPassword = await bcrypt.hash(body.password, 8);

    const newlyCreatedUser = this.userRepository.create({
      firstName,
      lastName,
      phone: body.contactNumber,
      email: body.email,
      password: hashedPassword,
      role: body.role,
      status: body.status,
      isEmailVerified: true,
      details: {
        address: body.address,
        dob: body.establishedAt,
        companyUanNumber: body.uanNumber,
      },
    });

    this.eventService.emit(
      'user.created',
      new UsercreatedEvent(newlyCreatedUser.email, {
        body: `Congratulations! You are registered to our organisation as a ${newlyCreatedUser.role}.`,
        name: newlyCreatedUser.firstName + newlyCreatedUser.lastName,
        loginId: newlyCreatedUser.email,
        password: body.password,
      }),
    );

    return await this.userRepository.save(newlyCreatedUser);
  }

  private adminUserPermissionManagement(): UserPermission {
    return {
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
    };
  }

  private hrPermissionManagement(): UserPermission {
    return {
      manageUser: true,
      notifications: true,
      holidayManagement: true,
      employeeManagement: true,
      attendanceManagement: true,
      payrollManagement: true,
      leaveManagement: true,
      recruitmentManagement: false,
      dashboard: {
        totalEmployeeCount: true,
        newJoineesCount: true,
        activeEmployeeCount: true,
        joiningRateCount: true,
        totalGrowth: {
          type: 'User_basis',
        },
      },
    };
  }

  private companyPermissionManagement(): UserPermission {
    return {
      notifications: true,
      employeeManagement: true,
      payrollManagement: true,
      attendanceManagement: true,
      dashboard: {
        totalEmployeeCount: true,
        activeEmployeeCount: true,
      },
    };
  }

  private employeePermissionManagement(): UserPermission {
    return {
      notifications: true,
      leaveManagement: true,
      attendanceManagement: true,
    };
  }
}
