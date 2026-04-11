import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../model/user.entity';

@Injectable()
export class UsersService {
  async findById(id: number): Promise<User> {
    try {
      return await User.findOneOrFail({ where: { id: String(id) } });
    } catch (error) {
      throw new NotFoundException(`User not exsists`);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await User.findOneOrFail({ where: { email } });
    } catch (error) {
      throw new NotFoundException(`User not exsists`);
    }
  }
}
