import {
  IsDate,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { UserRole } from '../../../modules/users/models/user.entity';
import { Type } from 'class-transformer';

export class SaveAdditionalDetailsforNextStep {
  @IsString()
  @IsNotEmpty()
  @IsEnum([UserRole.HR, UserRole.EMPLOYEE])
  role!: UserRole;

  @IsInt()
  @IsIn([2])
  step!: number;

  @IsString()
  @IsNotEmpty()
  joiningId!: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dob!: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  joininDate!: Date;
}
