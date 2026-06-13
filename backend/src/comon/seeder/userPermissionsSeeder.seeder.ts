import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserPermissions } from '../../modules/users/models/userPermissions.entity';

export default class UserPermissionsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(UserPermissions);
    const permissions = [
      'user-management',
      'leave-management',
      'employee-management',
      'payroll-management',
      'recruit-management',
    ];

    for (const permission of permissions) {
      const exists = await repository.findOne({
        where: { permissionvalue: permission },
      });

      if (!exists) {
        await repository.save({
          permissionvalue: permission,
        });
      }
    }
  }
}
