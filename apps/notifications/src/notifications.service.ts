import { Injectable } from "@nestjs/common";
import { NotifyEmailDto } from "./dto/notify-email.dto";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}

  private readonly transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: this.configService.get("SMTP_USER"),
      clientId: this.configService.get("GOOGLE_OAUTH_CLIENT_ID"),
      clientSecret: this.configService.get("GOOGLE_OAUTH_CLIENT_SECRET"),
      refreshToken: this.configService.get("GOOGLE_OAUTH_REFRESH_TOKEN"),
    },
  });

  async notifyEmail({ email }: NotifyEmailDto) {
    console.log("🚀 ~ NotificationsService ~ notifyEmail ~ email:", email);
    // Here you would implement the actual email sending logic, e.g., using a service like SendGrid or Nodemailer
    await this.transporter.sendMail({
      from: this.configService.get("SMTP_USER"),
      to: email,
      subject: "Notification",
      text: "This is a notification email.",
    });
  }
}
