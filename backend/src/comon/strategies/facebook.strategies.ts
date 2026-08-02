import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(protected readonly configService: ConfigService) {
    const clientID = configService.get<string>('socialAuth.facebook.clientId');
    const clientSecret = configService.get<string>(
      'socialAuth.facebook.clientSecret',
    );
    const callbackURL = configService.get<string>(
      'socialAuth.facebook.callbackUrl',
    );

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing required Facebook OAuth configuration');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
      scope: ['email'],
      passReqToCallback: true as const,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const { name, emails, photos } = profile;

    return {
      email: emails?.[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos?.[0]?.value,
      accessToken,
    };
  }
}
