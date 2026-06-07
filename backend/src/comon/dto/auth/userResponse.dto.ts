import { Exclude, Expose } from 'class-transformer';

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
  employment?: {
    id: string;
    employeeId: string;
    companyName: string;
    department?: string;
    designation?: string;
    headOfDepartment?: string;
    manager?: string;
    joiningDate: Date;
    leavingDate?: Date;
    salary?: number;
    employmentStatus: string;
    employmentType?: string;
    employeeCode?: string;
    workLocation?: string;
  };

  @Expose()
  details?: {
    id: string;
    dob: Date;
    address: string;
  };

  @Expose()
  message?: string;

  refreshToken?: string;
  @Expose()
  accessToken?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
