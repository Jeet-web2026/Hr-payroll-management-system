import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { UserRole } from '../../users/model/user.entity';

@Injectable()
export class PermissionmanagementService {
  constructor(private readonly userService: UsersService) {}

  async getallUsers(page: number, limit: number, request: any) {
    const requestedUser = await this.userService.findById(request.id);
    if (requestedUser.role === UserRole.HR) {
      return await this.userService.allUsers(page, limit);
    }
    return await this.userService.allUsers(page, limit);
  }
}
