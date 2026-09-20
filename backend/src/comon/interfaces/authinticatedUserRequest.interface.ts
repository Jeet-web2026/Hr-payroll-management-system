import { Request } from 'express';
import { JwtUser } from '../decorators/get-user.decorator';

export interface AuthenticatedRequest extends Request {
  user: JwtUser;
}
