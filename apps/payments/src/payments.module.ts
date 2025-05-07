import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import { LoggerModule, NOTIFICATIONS_SERVICE } from "@app/common";
import { ClientsModule } from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make the environment variables available globally
      envFilePath: "./apps/payments/.env", // load environment variables from .env file
      validationSchema: Joi.object({
        PORT: Joi.number().required(), // required to xxxx
        NOTIFICATIONS_HOST: Joi.string().required(), // required to xxxx
        NOTIFICATIONS_PORT: Joi.number().required(), // required to xxxx
        STRIPE_SECRET_KEY: Joi.string().required(), // required to xxxx
      }),
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: 1, // Transport.TCP,
          options: {
            host: configService.get("NOTIFICATIONS_HOST"),
            port: configService.get("NOTIFICATIONS_PORT"),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
