import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(protected readonly configService: ConfigService) {
    console.log('callbackURL:', configService.get<string>('socialAuth.facebook.callbackUrl'));
    console.log('clientSecret:', configService.get<string>('socialAuth.facebook.clientSecret'));
    console.log('clientId:', configService.get<string>('socialAuth.facebook.clientId'));
    super({
      clientID: configService.getOrThrow<string>('socialAuth.google.clientId'),
      clientSecret: configService.getOrThrow<string>('socialAuth.google.clientSecret'),
      callbackURL: configService.getOrThrow<string>('socialAuth.google.callbackUrl'),
      scope: ['email', 'profile'],
    });
  }
  authorizationParams(): Record<string, string> {
    return {
      access_type: 'offline',
      prompt: 'consent',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, photos } = profile;

    const user = {
      googleId: profile.id,
      email: emails?.[0]?.value ?? null,
      firstName: name?.givenName ?? null,
      lastName: name?.familyName ?? null,
      picture: photos?.[0]?.value ?? null,
      accessToken,
      refreshToken: refreshToken ?? null,
    };

    done(null, user);
  }
}
