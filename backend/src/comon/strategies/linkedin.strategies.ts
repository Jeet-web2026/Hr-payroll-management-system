import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private configService: ConfigService) {
    super({
      authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',

      tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',

      clientID: configService.get<string>('LINKEDIN_CLIENT_ID')!,

      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET')!,

      callbackURL: configService.get<string>('LINKEDIN_CALLBACK_URL')!,

      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(accessToken: string) {
    return {
      accessToken,
    };
  }
}
