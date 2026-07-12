import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionmanagementService } from '../service/permissionmanagement.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('permissionmanagement')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Permission Management')
export class PermissionmanagementcontrollerController {
  constructor(private readonly pmservice: PermissionmanagementService) {}


}
