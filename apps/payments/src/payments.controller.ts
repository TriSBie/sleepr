import { Controller, UsePipes, ValidationPipe } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
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
  ) // Use the ValidationPipe to validate incoming data
  async createCharge(@Payload() data: PaymentsCreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }
}
