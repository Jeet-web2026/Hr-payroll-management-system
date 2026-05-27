import { Test, TestingModule } from '@nestjs/testing';
import { PermissionmanagementcontrollerController } from './permissionmanagementcontroller.controller';

describe('PermissionmanagementcontrollerController', () => {
  let controller: PermissionmanagementcontrollerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionmanagementcontrollerController],
    }).compile();

    controller = module.get<PermissionmanagementcontrollerController>(PermissionmanagementcontrollerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
