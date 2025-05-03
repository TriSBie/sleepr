import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { LoggerModule } from "@app/common";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make the environment variables available globally
      envFilePath: "./apps/payments/.env", // load environment variables from .env file
      validationSchema: Joi.object({
        PORT: Joi.number().required(), // required to xxxx
        STRIPE_SECRET_KEY: Joi.string().required(), // required to xxxx
      }),
    }),
    LoggerModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
