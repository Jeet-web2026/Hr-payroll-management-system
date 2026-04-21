import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from '../../comon/strategies/google.strategies';
import type { StringValue } from 'ms';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_EXPIRES_IN',
            '60s',
          ) as StringValue,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
