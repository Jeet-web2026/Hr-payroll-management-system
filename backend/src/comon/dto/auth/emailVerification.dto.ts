import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class EmailVerificationDto {
  @Type(() => Number)
  @IsInt()
  @Min(100000)
  @Max(999999)
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 789456,
    description: 'Enter valid OTP for email verification',
  })
  emailCode!: number;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({
    required: true,
    description: 'Enter valid email for email verification.',
    example: 'johndoe@example.com',
  })
  email!: string;
}
