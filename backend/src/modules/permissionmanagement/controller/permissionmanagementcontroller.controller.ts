import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionmanagementService } from '../service/permissionmanagement.service';

@Controller('permissionmanagement')
@UseGuards(AuthGuard('jwt'))
export class PermissionmanagementcontrollerController {
  constructor(private readonly pmservice: PermissionmanagementService) {}


}
