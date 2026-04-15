import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailListener } from './listner/mail.listner';
import { MailService } from './service/mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: Number(process.env.MAIL_PORT),
          secure: true,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        },
        defaults: {
          from: `"TeamHub - Support" <${process.env.MAIL_FROM}>`,
        },
      }),
    }),
  ],
  providers: [MailService, MailListener],
  exports: [MailService],
})
export class MailModule {}
