import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(configService: ConfigService) {
    super({
      authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',

      tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',

      clientID: configService.get<string>('socialAuth.linkedin.clientId')!,

      clientSecret: configService.get<string>('socialAuth.linkedin.clientSecret')!,

      callbackURL: configService.get<string>('socialAuth.linkedin.callbackUrl')!,

      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(accessToken: string): Promise<any> {
    const axios = (await import('axios')).default;

    const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const profile = response.data;

    return {
      accessToken,
      profile,
    };
  }
}
