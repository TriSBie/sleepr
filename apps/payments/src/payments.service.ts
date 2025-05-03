import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { PaymentsCreateChargeDto } from "../dto/payments-create-charge.dto";

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get("STRIPE_SECRET_KEY");

    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not defined");
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: "2025-04-30.basil",
    });
  }
  async createCharge({ card, amount }: PaymentsCreateChargeDto) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: "card",
      card,
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      confirm: true,
      payment_method_types: ["card"],
      currency: "usd",
    });

    return paymentIntent;
  }
}
