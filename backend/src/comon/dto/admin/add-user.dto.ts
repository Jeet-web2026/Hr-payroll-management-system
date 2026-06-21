import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import {
  UserRole,
  UserStatus,
} from '../../../modules/users/models/user.entity';

export class AddUserFromAdmin {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  uanNumber?: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Contact number must be exactly 10 digits',
  })
  contactNumber!: string;

  @IsNotEmpty()
  @IsDateString()
  establishedAt!: Date;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;

  @IsNotEmpty()
  @IsEnum(UserStatus)
  status!: UserStatus;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password!: string;
}
