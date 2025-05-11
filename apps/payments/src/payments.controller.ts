import { Controller, UsePipes, ValidationPipe } from "@nestjs/common";
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from "@nestjs/microservices";
import { PaymentsService } from "./payments.service";
import { PaymentsCreateChargeDto } from "../dto/payments-create-charge.dto";

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern("create_charge")
  @UsePipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
    }),
  )
  async createCharge(
    @Payload() data: PaymentsCreateChargeDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage); // Acknowledge the message
    throw new Error("Not implemented yet");
    return this.paymentsService.createCharge(data);
  }
}
