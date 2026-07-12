import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import {
  UserRole,
  UserStatus,
} from '../../../modules/users/models/user.entity';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserFromAdmin {
  @ApiProperty({
    required: true,
    description: 'Name of the company',
    example: 'Example company',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({
    message: 'Name is required.',
  })
  name!: string;

  @ApiProperty({
    required: true,
    description: 'UAN number of the company.',
    example: '1234567890`',
  })
  @IsNotEmpty()
  @IsString()
  uanNumber?: string;

  @ApiProperty({
    required: true,
    description: 'Email of the company, Email must be a valid email address.',
    example: 'john.doe@company.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  
  @ApiProperty({
    required: true,
    description: 'Contact number of the company, Contact number must be exactly 10 digits.',
    example: '9876543210',
  })
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Contact number must be exactly 10 digits',
  })
  contactNumber!: string;

  @ApiProperty({
    required: true,
    description: 'Establishment date of the company, Establishment date must be a valid date string.',
    example: '2020-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  establishedAt!: Date;

  @ApiProperty({
    required: true,
    description: 'Address of the company, Address must be a non-empty string.',
    example: '123 Main Street',
  })
  @IsNotEmpty()
  @IsString()
  address!: string;

  @ApiProperty({
    required: true,
    description: 'Role of the company.',
    example: 'company',
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({
    required: true,
    description: 'Status of the company.',
    example: 'active',
  })
  @IsNotEmpty()
  @IsEnum(UserStatus)
  status!: UserStatus;

  @ApiProperty({
    required: true,
    description: 'Temporary password for the company, Password must be at least 8 characters long.',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password!: string;
}
