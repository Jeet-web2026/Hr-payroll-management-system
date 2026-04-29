import { Request } from 'express';

export interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}

export interface GoogleRequest extends Request {
  user: GoogleUser;
}
