import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../service/mail.service';
import {
  ResetPasswordMailEvent,
  UsercreatedEvent,
  WelcomeMailEvent,
} from '../events/mail.event';
import { OnEvent } from '@nestjs/event-emitter';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class MailListener {
  private readonly logger = new Logger(MailListener.name);

  constructor(
    private readonly mailService: MailService,
    private readonly userService: UsersService,
  ) {}

  @OnEvent('mail.welcome', { async: true })
  async handleWelcomeEmail(event: WelcomeMailEvent) {
    try {
      await this.mailService.sendWelcomeEmail(
        event.to,
        event.name,
        event.otp,
        event.otpExpiry,
      );
      this.logger.log(`✅ Welcome email sent to ${event.to}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to send welcome email to ${event.to}`,
        error,
      );
    }
  }

  @OnEvent('mail.reset-password', { async: true })
  async handleResetPasswordEmail(event: ResetPasswordMailEvent) {
    try {
      await this.mailService.sendResetPasswordEmail(event.to, event.token);
      this.logger.log(`✅ Reset password email sent to ${event.to}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send reset email to ${event.to}`, error);
    }
  }

  @OnEvent('user.created', { async: true })
  async handleSendUserCreatedEmail(event: UsercreatedEvent) {
    try {
      await this.userService.userPermissionManagement(
        event.data.userId,
        event.data.permissionData,
      );
      await this.mailService.senduserCreatedEmail(event.to, event.data);
      this.logger.log(`✅ User Created mail sent to ${event.to}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send reset email to ${event.to}`, error);
    }
  }
}
