import { AUTH_SERVICE, DatabaseModule, PAYMENTS_SERVICE } from "@app/common";
import { LoggerModule } from "@app/common/logger";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import * as Joi from "joi";
import {
  ReservationDocument,
  ReservationSchema,
} from "./models/reservations.schema";
import { ReservationsController } from "./reservations.controller";
import { ReservationsRepository } from "./reservations.repository";
import { ReservationsService } from "./reservations.service";

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: ReservationDocument.name,
        schema: ReservationSchema,
      },
    ]),
    LoggerModule,
    // forRoot is a method that allows you to load environment variables from a .env file
    ConfigModule.forRoot({
      isGlobal: true, // make the environment variables available globally
      envFilePath: "./apps/reservations/.env", // load environment variables from .env file
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(), // MONGODB_URI is required
        PORT: Joi.number().required(), // required to 3000
        AUTH_PORT: Joi.number().required(), // AUTH_PORT is required
        AUTH_HOST: Joi.string().required(), // AUTH_PORT is required
        PAYMENTS_PORT: Joi.number().required(), // AUTH_PORT is required
        PAYMENTS_HOST: Joi.string().required(), // AUTH_PORT is required
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>("RABBITMQ_URI")],
            queue: "auth",
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>("RABBITMQ_URI")],
            queue: "payments",
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository], // which services, repositories, or helpers should be created and available for this module
})
export class ReservationsModule {}
