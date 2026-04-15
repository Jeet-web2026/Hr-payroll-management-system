import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(
    to: string,
    name: string,
    otp: number,
    otpExpiry: Date,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to TeamHub',
      html: `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px;">
            <tr>
            <td align="center">
                
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; font-family:Arial, sans-serif;">
                
                <!-- Header -->
                <tr>
                    <td style="background:#4F46E5; color:#ffffff; padding:20px; text-align:center;">
                    <h1 style="margin:0; font-size:24px;">Welcome 🚀</h1>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding:30px; color:#333333;">
                    <h2 style="margin-top:0;">Hello ${name},</h2>
                    
                    <p style="font-size:16px; line-height:1.6;">
                        Welcome to our platform! We're excited to have you on board. 
                        Start exploring and make the most of our features.
                    </p>

                    <!-- Button -->
                    <table cellpadding="0" cellspacing="0" style="margin:30px 0;">
                        <tr>
                        <td align="center">
                            <a href="${process.env.APP_URL}/auth/otp-verification?otp=${otp}" 
                            style="
                                background:#4F46E5;
                                color:#ffffff;
                                padding:12px 24px;
                                text-decoration:none;
                                border-radius:6px;
                                font-size:16px;
                                display:inline-block;
                            ">
                            Verify Your Account
                            </a>
                        </td>
                        </tr>
                    </table>

                    <p style="font-size:14px; color:#777;">
                        This OTP is valid until ${otpExpiry.toLocaleTimeString()}.
                    </p>
                    <p style="font-size:14px; color:#777;">
                        If you have any query, please contact to the admin.
                    </p>
                    <p style="font-size:14px; color:#777; margin-top: 22px;">
                        Thank you,<br/>
                        <span style="font-weight: bold; margin-top: 8px;">TeamHub</span>
                    </p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background:#f9f9f9; text-align:center; padding:20px; font-size:12px; color:#999;">
                    © ${new Date().getFullYear()} Your Company. All rights reserved.
                    </td>
                </tr>

                </table>

            </td>
            </tr>
        </table>     
      `,
    });
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to,
      subject: 'Reset Your Password',
      html: `
        <h2>Reset Your Password</h2>
        <p>This link expires in <strong>15 minutes</strong>.</p>
        <a href="${resetUrl}" 
            style="padding: 10px 20px; background: #4F46E5; color: white; 
                    border-radius: 5px; text-decoration: none;">
            Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
     `,
    });
  }

  async sendEmailVerification(to: string, token: string): Promise<void> {
    const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
    await this.mailerService.sendMail({
      to,
      subject: 'Verify Your Email',
      html: `
        <h2>Verify Your Email</h2>
        <p>Click the button below to verify your email address.</p>
        <a href="${verifyUrl}" 
            style="padding: 10px 20px; background: #4F46E5; color: white; 
                    border-radius: 5px; text-decoration: none;">
            Verify Email
        </a>
        <p>If you didn't create an account, please ignore this email.</p>
     `,
    });
  }
}
