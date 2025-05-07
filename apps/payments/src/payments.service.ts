import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { PaymentsCreateChargeDto } from "../dto/payments-create-charge.dto";
import { NOTIFICATIONS_SERVICE } from "@app/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy, // Replace with the actual type if available
  ) {
    const secretKey = this.configService.get("STRIPE_SECRET_KEY");

    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not defined");
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: "2025-04-30.basil",
    });
  }

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: "pm_card_visa",
      amount: amount * 100,
      confirm: true,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // <-- This line prevents the redirect-based error
      },
    });

    console.log("🚀 ~ PaymentsService ~ createCharge ~ email:", email);

    this.notificationsService.emit("notify_email", {
      email,
    });

    return paymentIntent;
  }
}
