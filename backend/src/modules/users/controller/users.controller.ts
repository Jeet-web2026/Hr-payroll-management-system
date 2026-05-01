import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../../comon/decorators/get-user.decorator';
import type { JwtUser } from '../../../comon/decorators/get-user.decorator';
import { UserResponseDto } from '../../../comon/dto/auth/userResponse.dto';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@GetUser() user: JwtUser): Promise<UserResponseDto> {
    return await this.usersService.findById(user.id);
  }
}
