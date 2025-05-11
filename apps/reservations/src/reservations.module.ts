import { AUTH_SERVICE, DatabaseModule, PAYMENTS_SERVICE } from "@app/common";
import { LoggerModule } from "@app/common/logger";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import * as Joi from "joi";

import { ReservationsController } from "./reservations.controller";
import { ReservationsRepository } from "./reservations.repository";
import { ReservationsService } from "./reservations.service";
import { Reservation } from "./models/reservations.entity";

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Reservation]), // forFeature is a method that allows you to define models for the current module
    LoggerModule,
    // forRoot is a method that allows you to load environment variables from a .env file
    ConfigModule.forRoot({
      isGlobal: true, // make the environment variables available globally
      envFilePath: "./apps/reservations/.env", // load environment variables from .env file
      validationSchema: Joi.object({
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
          transport: Transport.TCP,
          options: {
            host: configService.get("AUTH_HOST"),
            port: configService.get("AUTH_PORT"),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get("PAYMENTS_HOST"),
            port: configService.get("PAYMENTS_PORT"),
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
