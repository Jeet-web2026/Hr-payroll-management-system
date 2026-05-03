import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class DashboardService {
  constructor(private userService: UsersService) {}

  async getDashboardData(user: any) {
    return this.userService.statictics(user.id);
  }
}
