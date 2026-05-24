import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import * as express from 'express';
import { UserRole } from '../../users/model/user.entity';
import { Repository } from 'typeorm';
import { Request } from '../model/request.model';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RequestService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async allRequests(request: express.Request) {
    try {
      const requestedUser = request.user as any;
      const user = await this.userService.findById(requestedUser.id);

      if (user.role === UserRole.HR) {
        return await this.requestRepository.find();
      }

      if (user.role === UserRole.EMPLOYEE) {
        return await this.requestRepository.find({
          where: {
            userId: user.id,
          },
        });
      }

      throw new UnauthorizedException('You are not authorised!');
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
