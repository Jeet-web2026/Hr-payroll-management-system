import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase, one lowercase, and one special character',
  })
  password: string;

  @IsNotEmpty()
  confirmpassword: string;
}
