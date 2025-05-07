import { Controller, UsePipes, ValidationPipe } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { NotifyEmailDto } from "./dto/notify-email.dto";
import { NotificationsService } from "./notifications.service";

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern("notify_email")
  @UsePipes(new ValidationPipe())
  async notifyEmail(@Payload() data: NotifyEmailDto) {
    console.log("🚀 ~ NotificationsController ~ notifyEmail ~ data:", data);
    return this.notificationsService.notifyEmail(data);
  }
}
