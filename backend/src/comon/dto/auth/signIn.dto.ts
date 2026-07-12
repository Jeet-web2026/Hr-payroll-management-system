import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'Email of the user, Email must be a valid email address.',
    example: 'example@teamhub.com',
  })
  email!: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase, one lowercase, and one special character',
  })
  @ApiProperty({
    required: true,
    description:
      'Password of the user, Password must be at least 8 characters long and contain at least one uppercase, one lowercase, and one special character.',
    example: 'Password@123',
  })
  password!: string;
}
