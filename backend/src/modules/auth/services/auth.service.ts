import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from '../../../comon/dto/auth/signIn.dto';
import { UsersService } from '../../users/services/users.service';
import { UserDataDto } from '../../../comon/dto/auth/userData.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async signIn(signinDto: SignInDto): Promise<any> {
    try {
      return this.userService.findByEmail(signinDto.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async signUp(userData: UserDataDto): Promise<any> {
    return this.userService.createUser(userData);
  }
}
