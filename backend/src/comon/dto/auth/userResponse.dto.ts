import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserDetailsDto {
  @Expose() id!: string;
  @Expose() dob!: Date;
  @Expose() address!: string;
  @Expose() companyUanNumber!: string;
}

@Exclude()
export class UserEmploymentDetailsDto {
  @Expose() id!: string;
  @Expose() employeeId!: string;
  @Expose() companyName!: string;
  @Expose() department?: string;
  @Expose() designation?: string;
  @Expose() headOfDepartment?: string;
  @Expose() manager?: string;
  @Expose() joiningDate!: Date;
  @Expose() leavingDate?: Date;
  @Expose() salary?: number;
  @Expose() employmentStatus!: string;
  @Expose() employmentType?: string;
  @Expose() employeeCode?: string;
  @Expose() workLocation?: string;
}

@Exclude()
export class UserResponseDto {
  @Expose() id!: string;
  @Expose() firstName!: string;
  @Expose() lastName!: string;
  @Expose() email!: string;
  @Expose() role!: string;
  @Expose() status!: string;
  @Expose() loginStatus!: string;
  @Expose() isEmailVerified!: boolean;
  @Expose() lastLogin!: Date;
  @Expose() phone!: number;
  @Expose() profilePicture!: string;

  @Expose()
  @Type(() => UserDetailsDto)
  employment?: UserEmploymentDetailsDto;

  @Expose()
  @Type(() => UserDetailsDto)
  details?: UserDetailsDto;

  @Expose()
  message?: string;

  @Expose()
  refreshToken?: string;

  @Expose()
  accessToken?: string;

  @Expose()
  usersPermissionManagement?: {
    manageUser?: boolean;
    notifications?: boolean;
    dashboard?: {
      totalEmployeeCount?: boolean;
      newJoineesCount?: boolean;
      activeEmployeeCount?: boolean;
      joiningRateCount?: boolean;
      totalGrowth?: {
        type?: string;
      };
    };
    holidayManagement?: boolean;
    employeeManagement?: boolean;
    attendanceManagement?: boolean;
    payrollManagement?: boolean;
    leaveManagement?: boolean;
    recrumentManagement?: boolean;
  };

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
