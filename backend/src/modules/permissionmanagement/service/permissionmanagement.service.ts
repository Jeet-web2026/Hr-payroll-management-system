import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class PermissionmanagementService {
  constructor(private readonly userService: UsersService) {}
}
