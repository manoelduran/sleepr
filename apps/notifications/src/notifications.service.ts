import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}
  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get('SMTP_USER'),
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  });

  async notifyEmail({ email }: NotifyEmailDto) {
    const mailOptions = {
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: 'Reservation Confirmation',
      text: 'Your reservation has been confirmed!',
    };
    return this.transporter.sendMail(mailOptions);
  }
}
