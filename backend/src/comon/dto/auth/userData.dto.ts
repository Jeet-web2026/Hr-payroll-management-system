import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserDataDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'Firstname of the user.',
    example: 'John',
  })
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'Lastname of the user.',
    example: 'Doe',
  })
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
    description: 'Email of the user. Please provide a valid email.',
    example: 'johndoe@example.com',
  })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase, one lowercase, and one special character',
  })
  @ApiProperty({
    required: true,
    description: 'Password of the user.',
    example: 'Password@123!',
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'Confirmpassword of the user.',
    example: 'Password@123!',
  })
  confirmpassword!: string;
}
