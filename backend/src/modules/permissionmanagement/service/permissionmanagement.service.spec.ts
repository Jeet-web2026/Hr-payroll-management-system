import { Test, TestingModule } from '@nestjs/testing';
import { PermissionmanagementService } from './permissionmanagement.service';

describe('PermissionmanagementService', () => {
  let service: PermissionmanagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionmanagementService],
    }).compile();

    service = module.get<PermissionmanagementService>(PermissionmanagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
